import { callClaude } from "../claude";
import { GH_HEADERS, type ChargeFn, type Env } from "../types";

export async function handlePRReview(
  request: Request,
  env: Env,
  charge: ChargeFn,
): Promise<Response> {
  const { pathname } = new URL(request.url);
  const match = pathname.match(/^\/review\/repos\/([^/]+)\/([^/]+)\/pulls\/(\d+)$/);
  if (!match) return new Response("Not Found", { status: 404 });
  const [, owner, repo, pullNumber] = match;

  const result = await charge("0.01")(request);
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
    return result.withReceipt(
      Response.json({ error: "GitHub API error", status: prRes.status, detail }),
    );
  }

  const pr = await prRes.json() as {
    title: string;
    body: string;
    changed_files: number;
    additions: number;
    deletions: number;
  };
  const diff = await diffRes.text();
  const truncatedDiff = diff.length > 12000
    ? diff.slice(0, 12000) + "\n\n[diff truncated...]"
    : diff;

  const review = await callClaude(
    env.ANTHROPIC_API_KEY,
    `Review this GitHub pull request and provide concise, actionable feedback.

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
  );

  return result.withReceipt(Response.json({
    pr: {
      title: pr.title,
      number: Number(pullNumber),
      repo: `${owner}/${repo}`,
      changed_files: pr.changed_files,
      additions: pr.additions,
      deletions: pr.deletions,
    },
    review,
  }));
}
