import { custom, Proxy } from "mppx/proxy";
import { Mppx, tempo } from "mppx/server";

type Env = {
  GITHUB_TOKEN: string;
  RECIPIENT: string;
  MPP_SECRET_KEY: string;
  ANTHROPIC_API_KEY: string;
};

type MppxInstance = ReturnType<typeof Mppx.create>;

let cachedMppx: MppxInstance | null = null;
let cachedProxy: { fetch: (req: Request) => Promise<Response> } | null = null;
let lastEnvKey = "";

const GH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "github-mpp-proxy/1.0",
});

function getInstances(env: Env) {
  const envKey = env.GITHUB_TOKEN + env.RECIPIENT + env.MPP_SECRET_KEY;
  if (cachedMppx && cachedProxy && envKey === lastEnvKey) {
    return { mppx: cachedMppx, proxy: cachedProxy };
  }

  const mppx = Mppx.create({
    methods: [tempo({ recipient: env.RECIPIENT as `0x${string}` })],
    secretKey: env.MPP_SECRET_KEY,
  });

  const github = custom("github", {
    baseUrl: "https://api.github.com",
    title: "GitHub API",
    description: "GitHub REST API — repos, issues, PRs, search, users.",
    rewriteRequest(req) {
      req.headers.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
      req.headers.set("Accept", "application/vnd.github+json");
      req.headers.set("X-GitHub-Api-Version", "2022-11-28");
      req.headers.set("User-Agent", "github-mpp-proxy/1.0");
      req.headers.delete("host");
      return req;
    },
    routes: {
      "GET /repos/:owner/:repo":            mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/issues":     mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/issues/:id": mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/pulls":      mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/pulls/:id":  mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/commits":    mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/contents/*": mppx.charge({ amount: "0.001" }),
      "GET /users/:username":               mppx.charge({ amount: "0.001" }),
      "GET /users/:username/repos":         mppx.charge({ amount: "0.001" }),
      "GET /search/repositories":           mppx.charge({ amount: "0.002" }),
      "GET /search/issues":                 mppx.charge({ amount: "0.002" }),
      "GET /search/code":                   mppx.charge({ amount: "0.002" }),
      "GET /orgs/:org/repos":               mppx.charge({ amount: "0.001" }),
      "GET /rate_limit":                    true,
    },
  });

  const ai = custom("ai", {
    baseUrl: "https://github.tempflow.xyz",
    title: "GitHub AI",
    description: "AI-powered analysis of GitHub PRs and issues using Claude.",
    rewriteRequest: (req) => req,
    routes: {
      "GET /review/repos/:owner/:repo/pulls/:id":  mppx.charge({ amount: "0.01" }),
      "GET /analyze/repos/:owner/:repo/issues/:id": mppx.charge({ amount: "0.005" }),
    },
  });

  const proxy = Proxy.create({
    title: "GitHub MPP Proxy",
    description:
      "GitHub REST API + AI-powered PR reviews and issue analysis via Tempo payments.",
    services: [github, ai],
  });

  cachedMppx = mppx;
  cachedProxy = proxy;
  lastEnvKey = envKey;
  return { mppx, proxy };
}

async function callClaude(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json() as { content: { text: string }[] };
  return data.content?.[0]?.text ?? "Could not generate response.";
}

async function handlePRReview(request: Request, env: Env, mppx: MppxInstance): Promise<Response> {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/review\/repos\/([^/]+)\/([^/]+)\/pulls\/(\d+)$/);
  if (!match) return new Response("Not Found", { status: 404 });
  const [, owner, repo, pullNumber] = match;

  const result = await mppx.charge({ amount: "0.01" })(request);
  if (result.status === 402) return result.challenge;

  const headers = GH_HEADERS(env.GITHUB_TOKEN);
  const [prRes, diffRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
      headers: { ...headers, Accept: "application/vnd.github.v3.diff" },
    }),
  ]);

  if (!prRes.ok) {
    const detail = await prRes.text();
    return result.withReceipt(Response.json({ error: "GitHub API error", status: prRes.status, detail }));
  }

  const pr = await prRes.json() as { title: string; body: string; changed_files: number; additions: number; deletions: number };
  const diff = await diffRes.text();
  const truncatedDiff = diff.length > 12000 ? diff.slice(0, 12000) + "\n\n[diff truncated...]" : diff;

  const review = await callClaude(env.ANTHROPIC_API_KEY, `Review this GitHub pull request and provide concise, actionable feedback.

PR Title: ${pr.title}
PR Description: ${pr.body || "(none)"}
Files changed: ${pr.changed_files} (+${pr.additions} -${pr.deletions})

Diff:
${truncatedDiff}

Provide:
1. Summary (2-3 sentences)
2. Key issues or concerns (if any)
3. Suggestions for improvement
4. Overall verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION`);

  return result.withReceipt(Response.json({
    pr: { title: pr.title, number: Number(pullNumber), repo: `${owner}/${repo}`, changed_files: pr.changed_files, additions: pr.additions, deletions: pr.deletions },
    review,
  }));
}

async function handleIssueAnalysis(request: Request, env: Env, mppx: MppxInstance): Promise<Response> {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/analyze\/repos\/([^/]+)\/([^/]+)\/issues\/(\d+)$/);
  if (!match) return new Response("Not Found", { status: 404 });
  const [, owner, repo, issueNumber] = match;

  const result = await mppx.charge({ amount: "0.005" })(request);
  if (result.status === 402) return result.challenge;

  const headers = GH_HEADERS(env.GITHUB_TOKEN);
  const [issueRes, commentsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=20`, { headers }),
  ]);

  if (!issueRes.ok) {
    const detail = await issueRes.text();
    return result.withReceipt(Response.json({ error: "GitHub API error", status: issueRes.status, detail }));
  }

  const issue = await issueRes.json() as { title: string; body: string; state: string; labels: { name: string }[]; user: { login: string }; comments: number };
  const comments = commentsRes.ok ? await commentsRes.json() as { user: { login: string }; body: string }[] : [];

  const commentText = comments.slice(0, 10)
    .map((c, i) => `Comment ${i + 1} by @${c.user.login}:\n${c.body}`)
    .join("\n\n");

  const analysis = await callClaude(env.ANTHROPIC_API_KEY, `Analyze this GitHub issue and provide a clear, structured summary.

Issue: #${issueNumber} — ${issue.title}
State: ${issue.state}
Author: @${issue.user.login}
Labels: ${issue.labels.map(l => l.name).join(", ") || "none"}
Total comments: ${issue.comments}

Issue body:
${issue.body || "(no description)"}

${commentText ? `Comments:\n${commentText}` : ""}

Provide:
1. Problem summary (2-3 sentences — what is the issue about?)
2. Root cause (if identifiable from the discussion)
3. Proposed solutions mentioned (if any)
4. Current status & next steps
5. Priority assessment: CRITICAL / HIGH / MEDIUM / LOW`);

  return result.withReceipt(Response.json({
    issue: {
      title: issue.title,
      number: Number(issueNumber),
      repo: `${owner}/${repo}`,
      state: issue.state,
      labels: issue.labels.map(l => l.name),
      comments: issue.comments,
    },
    analysis,
  }));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { mppx, proxy } = getInstances(env);
    const { pathname } = new URL(request.url);

    if (pathname.startsWith("/review/")) return handlePRReview(request, env, mppx);
    if (pathname.startsWith("/analyze/")) return handleIssueAnalysis(request, env, mppx);

    return proxy.fetch(request);
  },
};
