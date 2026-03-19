import { callClaude } from "../claude";
import { GH_HEADERS, type ChargeFn, type Env } from "../types";

export async function handleIssueAnalysis(
  request: Request,
  env: Env,
  charge: ChargeFn,
): Promise<Response> {
  const { pathname } = new URL(request.url);
  const match = pathname.match(/^\/analyze\/repos\/([^/]+)\/([^/]+)\/issues\/(\d+)$/);
  if (!match) return new Response("Not Found", { status: 404 });
  const [, owner, repo, issueNumber] = match;

  const result = await charge("0.005")(request);
  if (result.status === 402) return result.challenge;

  const headers = GH_HEADERS(env.GITHUB_TOKEN);
  const [issueRes, commentsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=20`, { headers }),
  ]);

  if (!issueRes.ok) {
    const detail = await issueRes.text();
    return result.withReceipt(
      Response.json({ error: "GitHub API error", status: issueRes.status, detail }),
    );
  }

  const issue = await issueRes.json() as {
    title: string;
    body: string;
    state: string;
    labels: { name: string }[];
    user: { login: string };
    comments: number;
  };
  const comments = commentsRes.ok
    ? await commentsRes.json() as { user: { login: string }; body: string }[]
    : [];

  const commentText = comments
    .slice(0, 10)
    .map((c, i) => `Comment ${i + 1} by @${c.user.login}:\n${c.body}`)
    .join("\n\n");

  const analysis = await callClaude(
    env.ANTHROPIC_API_KEY,
    `Analyze this GitHub issue and provide a clear, structured summary.

Issue: #${issueNumber} — ${issue.title}
State: ${issue.state}
Author: @${issue.user.login}
Labels: ${issue.labels.map(l => l.name).join(", ") || "none"}
Total comments: ${issue.comments}

Issue body:
${issue.body || "(no description)"}

${commentText ? `Comments:\n${commentText}` : ""}

Provide:
1. Problem summary (2-3 sentences)
2. Root cause (if identifiable)
3. Proposed solutions mentioned (if any)
4. Current status & next steps
5. Priority: CRITICAL / HIGH / MEDIUM / LOW`,
  );

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
