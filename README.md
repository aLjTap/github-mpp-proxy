# GitHub MPP Proxy

> Access the GitHub REST API with [Tempo](https://tempo.xyz) payments — no GitHub token needed.

AI agents and CLI clients can query GitHub by paying per request using the [Machine Payments Protocol](https://mpp.dev). No API key management, no rate limit sharing, no sign-up required.

**Live at [`github.tempflow.xyz`](https://github.tempflow.xyz)**

---

## How it works

```
your agent
    │
    │  tempo request -t https://github.tempflow.xyz/github/repos/facebook/react
    ▼
GitHub MPP Proxy          ← verifies Tempo payment ($0.001 USDC)
    │
    │  GET https://api.github.com/repos/facebook/react
    ▼
GitHub API                ← responds with repo data
    │
    ▼
your agent gets the result
```

---

## Quickstart

```bash
# 1. Install the Tempo CLI
curl -fsSL https://tempo.xyz/install | bash

# 2. Login (opens browser)
tempo wallet login

# 3. Start querying GitHub
tempo request -t https://github.tempflow.xyz/github/repos/facebook/react
tempo request -t https://github.tempflow.xyz/github/users/torvalds
tempo request -t "https://github.tempflow.xyz/github/search/repositories?q=mppx"
```

---

## Endpoints

| Method | Path | Price |
|--------|------|-------|
| GET | `/github/repos/:owner/:repo` | $0.001 |
| GET | `/github/repos/:owner/:repo/issues` | $0.001 |
| GET | `/github/repos/:owner/:repo/issues/:id` | $0.001 |
| GET | `/github/repos/:owner/:repo/pulls` | $0.001 |
| GET | `/github/repos/:owner/:repo/pulls/:id` | $0.001 |
| GET | `/github/repos/:owner/:repo/commits` | $0.001 |
| GET | `/github/repos/:owner/:repo/contents/*` | $0.001 |
| GET | `/github/users/:username` | $0.001 |
| GET | `/github/users/:username/repos` | $0.001 |
| GET | `/github/orgs/:org/repos` | $0.001 |
| GET | `/github/search/repositories` | $0.002 |
| GET | `/github/search/issues` | $0.002 |
| GET | `/github/search/code` | $0.002 |
| GET | `/github/rate_limit` | free |

---

## Service discovery

The proxy exposes standard MPP discovery endpoints so agents can automatically understand what's available:

```bash
# Human-readable overview
curl https://github.tempflow.xyz/llms.txt

# Machine-readable service index
curl https://github.tempflow.xyz/discover

# Full route details
curl https://github.tempflow.xyz/discover/github.md
```

---

## Deploy your own

Fork this repo and deploy in minutes:

```bash
git clone https://github.com/aLjTap/github-mpp-proxy
cd github-mpp-proxy
bun install

# Add your GitHub token and a random secret key
bunx wrangler secret put GITHUB_TOKEN
bunx wrangler secret put MPP_SECRET_KEY

# Deploy to Cloudflare Workers
bunx wrangler deploy
```

You'll need:
- A [GitHub personal access token](https://github.com/settings/tokens/new?scopes=public_repo) with `public_repo` scope
- A [Cloudflare account](https://cloudflare.com) (free tier is enough)
- A [Tempo wallet](https://wallet.tempo.xyz) to receive payments

---

## Built with

- [mppx](https://github.com/wevm/mppx) — TypeScript SDK for the Machine Payments Protocol
- [Cloudflare Workers](https://workers.cloudflare.com) — serverless edge runtime
- [Tempo](https://tempo.xyz) — stablecoin payment network
