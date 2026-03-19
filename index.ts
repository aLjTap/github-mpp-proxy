import { custom, Proxy } from "mppx/proxy";
import { Mppx, tempo } from "mppx/server";

type Env = {
  GITHUB_TOKEN: string;
  RECIPIENT: string;
  MPP_SECRET_KEY: string;
  ANTHROPIC_API_KEY: string;
};

// Cache proxy and mppx instances
let cachedMppx: ReturnType<typeof Mppx.create> | null = null;
let cachedProxy: { fetch: (req: Request) => Promise<Response> } | null = null;
let lastEnvKey = "";

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
    description: "GitHub REST API proxy with automatic payments via Tempo.",
    rewriteRequest(req) {
      req.headers.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
      req.headers.set("Accept", "application/vnd.github+json");
      req.headers.set("X-GitHub-Api-Version", "2022-11-28");
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

  const reviewService = custom("review", {
    baseUrl: "https://github.tempflow.xyz", // unused, handled manually
    title: "GitHub PR Review",
    description: "AI-powered code review for any GitHub pull request.",
    rewriteRequest: (req) => req,
    routes: {
      "GET /repos/:owner/:repo/pulls/:id": mppx.charge({ amount: "0.01" }),
    },
  });

  const proxy = Proxy.create({
    title: "GitHub MPP Proxy",
    description:
      "Access the GitHub REST API and AI-powered PR reviews using Tempo payments.",
    services: [github, reviewService],
  });

  cachedMppx = mppx;
  cachedProxy = proxy;
  lastEnvKey = envKey;
  return { mppx, proxy };
}

async function handleReview(request: Request, env: Env, mppx: ReturnType<typeof Mppx.create>): Promise<Response> {
  // Parse /review/repos/:owner/:repo/pulls/:id
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/review\/repos\/([^/]+)\/([^/]+)\/pulls\/(\d+)$/);
  if (!match) return new Response("Not Found", { status: 404 });

  const [, owner, repo, pullNumber] = match;

  // MPP payment check
  const intent = mppx.charge({ amount: "0.01" });
  const result = await intent(request);
  if (result.status === 402) return result.challenge;

  // Fetch PR details + diff from GitHub
  const ghHeaders = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-mpp-proxy/1.0",
  };

  const [prRes, diffRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, { headers: ghHeaders }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
      headers: { ...ghHeaders, Accept: "application/vnd.github.v3.diff" },
    }),
  ]);

  if (!prRes.ok) {
    const errText = await prRes.text();
    return result.withReceipt(Response.json({ error: "GitHub API error", status: prRes.status, detail: errText }));
  }

  const pr = await prRes.json() as { title: string; body: string; changed_files: number; additions: number; deletions: number };
  const diff = await diffRes.text();

  // Truncate diff if too large
  const truncatedDiff = diff.length > 12000 ? diff.slice(0, 12000) + "\n\n[diff truncated...]" : diff;

  // Call Anthropic
  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Review this GitHub pull request and provide concise, actionable feedback.

PR Title: ${pr.title}
PR Description: ${pr.body || "(none)"}
Files changed: ${pr.changed_files} (+${pr.additions} -${pr.deletions})

Diff:
${truncatedDiff}

Provide:
1. Summary (2-3 sentences)
2. Key issues or concerns (if any)
3. Suggestions for improvement
4. Overall verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION`,
        },
      ],
    }),
  });

  const review = await anthropicRes.json() as { content: { text: string }[] };
  const reviewText = review.content?.[0]?.text ?? "Could not generate review.";

  const response = Response.json({
    pr: {
      title: pr.title,
      number: Number(pullNumber),
      repo: `${owner}/${repo}`,
      changed_files: pr.changed_files,
      additions: pr.additions,
      deletions: pr.deletions,
    },
    review: reviewText,
  });

  return result.withReceipt(response);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { mppx, proxy } = getInstances(env);
    const url = new URL(request.url);

    // Route PR review requests to custom handler
    if (url.pathname.startsWith("/review/")) {
      return handleReview(request, env, mppx);
    }

    return proxy.fetch(request);
  },
};
