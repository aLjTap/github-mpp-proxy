# GitHub MPP Proxy

> GitHub REST API + AI-powered PR reviews and issue analysis — pay per request with [Tempo](https://tempo.xyz).

No GitHub token needed. No sign-up. Just a Tempo wallet and you're in.

**Live at [`github.tempflow.xyz`](https://github.tempflow.xyz)**

---

## How it works

```
your agent
    │
    │  tempo request -t https://github.tempflow.xyz/...
    ▼
GitHub MPP Proxy  ←  verifies Tempo payment
    │
    ├──► GitHub API       (raw data endpoints)
    └──► Anthropic Claude (AI review & analysis)
    │
    ▼
result returned to your agent
```

---

## Quickstart

```bash
# Install Tempo CLI
curl -fsSL https://tempo.xyz/install | bash

# Login
tempo wallet login

# Query GitHub
tempo request -t https://github.tempflow.xyz/github/repos/facebook/react

# AI PR Review
tempo request -t https://github.tempflow.xyz/review/repos/vercel/next.js/pulls/91670

# AI Issue Analysis
tempo request -t https://github.tempflow.xyz/analyze/repos/facebook/react/issues/31716
```

---

## Endpoints

### GitHub Data — $0.001 per request

| Method | Path |
|--------|------|
| GET | `/github/repos/:owner/:repo` |
| GET | `/github/repos/:owner/:repo/issues` |
| GET | `/github/repos/:owner/:repo/issues/:id` |
| GET | `/github/repos/:owner/:repo/pulls` |
| GET | `/github/repos/:owner/:repo/pulls/:id` |
| GET | `/github/repos/:owner/:repo/commits` |
| GET | `/github/repos/:owner/:repo/contents/*` |
| GET | `/github/users/:username` |
| GET | `/github/users/:username/repos` |
| GET | `/github/orgs/:org/repos` |
| GET | `/github/search/repositories` |
| GET | `/github/search/issues` |
| GET | `/github/search/code` |
| GET | `/github/rate_limit` — **free** |

### AI Analysis — powered by Claude

| Method | Path | Price | What it does |
|--------|------|-------|-------------|
| GET | `/review/repos/:owner/:repo/pulls/:id` | $0.010 | Code review with verdict |
| GET | `/analyze/repos/:owner/:repo/issues/:id` | $0.005 | Issue summary & priority |

---

## Example responses

**PR Review** (`/review/repos/vercel/next.js/pulls/91670`):
```json
{
  "pr": {
    "title": "fix: use origin for path-absolute URLs",
    "number": 91670,
    "repo": "vercel/next.js",
    "changed_files": 2,
    "additions": 6,
    "deletions": 3
  },
  "review": "## Summary\n...\n## Overall Verdict\nAPPROVE"
}
```

**Issue Analysis** (`/analyze/repos/facebook/react/issues/31716`):
```json
{
  "issue": {
    "title": "[Flight] Track Timing Information",
    "number": 31716,
    "state": "closed",
    "labels": ["React Core Team"]
  },
  "analysis": "## Problem Summary\n...\n## Priority: MEDIUM"
}
```

---

## Service discovery

```bash
curl https://github.tempflow.xyz/llms.txt      # for agents
curl https://github.tempflow.xyz/discover       # JSON
curl https://github.tempflow.xyz/discover/github.md
curl https://github.tempflow.xyz/discover/ai.md
```

---

## Deploy your own

```bash
git clone https://github.com/aLjTap/github-mpp-proxy
cd github-mpp-proxy
bun install

# Secrets
bunx wrangler secret put GITHUB_TOKEN      # github.com/settings/tokens (public_repo)
bunx wrangler secret put ANTHROPIC_API_KEY # console.anthropic.com
bunx wrangler secret put MPP_SECRET_KEY    # openssl rand -hex 32

# Deploy
bunx wrangler deploy
```

---

## Stack

- [mppx](https://github.com/wevm/mppx) — TypeScript SDK for the Machine Payments Protocol
- [Cloudflare Workers](https://workers.cloudflare.com) — serverless edge runtime
- [Tempo](https://tempo.xyz) — stablecoin payment network
- [Claude](https://anthropic.com) — AI for PR reviews and issue analysis
