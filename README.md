# GitHub MPP Proxy

Access the [GitHub REST API](https://docs.github.com/en/rest) using [Tempo](https://tempo.xyz) payments — no GitHub token needed.

Built with [mppx](https://mpp.dev) for the Machine Payments Protocol (MPP). Live at `github.tempflow.xyz`.

## Usage

Any agent or client with a Tempo wallet can query GitHub without managing API keys:

```bash
# Install tempo CLI
curl -fsSL https://tempo.xyz/install | bash

# Get a repo
tempo request -t https://github.tempflow.xyz/github/repos/facebook/react

# Search repositories
tempo request -t "https://github.tempflow.xyz/github/search/repositories?q=mppx"

# List issues
tempo request -t https://github.tempflow.xyz/github/repos/vercel/next.js/issues
```

## Service discovery

```bash
# JSON
curl https://github.tempflow.xyz/discover

# Markdown (for agents)
curl https://github.tempflow.xyz/llms.txt
```

## Endpoints & pricing

| Route | Price |
|---|---|
| `GET /repos/:owner/:repo` | $0.001 |
| `GET /repos/:owner/:repo/issues` | $0.001 |
| `GET /repos/:owner/:repo/pulls` | $0.001 |
| `GET /repos/:owner/:repo/commits` | $0.001 |
| `GET /repos/:owner/:repo/contents/*` | $0.001 |
| `GET /users/:username` | $0.001 |
| `GET /users/:username/repos` | $0.001 |
| `GET /search/repositories` | $0.002 |
| `GET /search/issues` | $0.002 |
| `GET /search/code` | $0.002 |
| `GET /orgs/:org/repos` | $0.001 |
| `GET /rate_limit` | free |

## Deploy your own

```bash
git clone https://github.com/alikarkinsarac/github-mpp-proxy
cd github-mpp-proxy
bun install

# Set secrets
wrangler secret put GITHUB_TOKEN
wrangler secret put MPP_SECRET_KEY

# Deploy
bunx wrangler deploy
```

## Stack

- [mppx](https://github.com/wevm/mppx) — MPP TypeScript SDK
- [Cloudflare Workers](https://workers.cloudflare.com) — serverless runtime
- [Tempo](https://tempo.xyz) — stablecoin payment network
