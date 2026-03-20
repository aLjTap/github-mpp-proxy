export const html = /* html */ `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GitHub MPP Proxy</title>
  <meta name="description" content="Access the GitHub API via Tempo payments. No API keys. No accounts. Pay per request with USDC." />
  <meta property="og:title" content="GitHub MPP Proxy" />
  <meta property="og:description" content="Access the GitHub API via Tempo payments. No API keys. No accounts. Pay per request." />
  <meta property="og:url" content="https://github.tempflow.xyz" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://github.tempflow.xyz/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="GitHub MPP Proxy" />
  <meta name="twitter:description" content="Access the GitHub API via Tempo payments. No API keys. No accounts. Pay per request." />
  <meta name="twitter:image" content="https://github.tempflow.xyz/og.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Fira+Code:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --background: oklch(0.2891 0 0);
      --foreground: oklch(0.8945 0 0);
      --card: oklch(0.3211 0 0);
      --card-foreground: oklch(0.8945 0 0);
      --muted: oklch(0.3904 0 0);
      --muted-foreground: oklch(0.7058 0 0);
      --border: oklch(0.4276 0 0);
      --accent: oklch(0.9067 0 0);
      --primary: oklch(0.7572 0 0);
      --green: oklch(0.7236 0.1799 142.5);
      --blue: oklch(0.7028 0.1285 236.5);
      --yellow: oklch(0.8319 0.1285 85.8);
      --purple: oklch(0.7366 0.1421 306.0);
      --radius: 0.625rem;
      --font-sans: "Architects Daughter", sans-serif;
      --font-mono: "Fira Code", "Courier New", monospace;
      --tracking: 0.5px;
    }

    body {
      background: var(--background);
      color: var(--foreground);
      font-family: var(--font-sans);
      letter-spacing: var(--tracking);
      line-height: 1.6;
      padding: 2.5rem 1.25rem;
    }

    .container { max-width: 880px; margin: 0 auto; }

    /* Header */
    header { margin-bottom: 0.5rem; }

    .header-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--foreground);
    }

    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      background: oklch(0.28 0.08 142.5 / 0.3);
      color: var(--green);
      border: 1px solid oklch(0.5 0.12 142.5 / 0.4);
      font-family: var(--font-mono);
    }

    .live-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--green);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .subtitle {
      color: var(--muted-foreground);
      font-size: 0.95rem;
      margin-bottom: 2.5rem;
    }

    .subtitle a { color: var(--blue); text-decoration: none; }
    .subtitle a:hover { text-decoration: underline; }

    /* Section */
    .section-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--muted-foreground);
      margin-bottom: 0.75rem;
      margin-top: 2.25rem;
      font-family: var(--font-mono);
    }

    /* Cards */
    .cards { display: grid; gap: 0.875rem; }

    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem 1.5rem;
      transition: border-color 0.15s;
    }

    .card:hover { border-color: oklch(0.55 0 0); }

    .card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.35rem;
    }

    .card-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--foreground);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price-tag {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .price-default { color: var(--yellow); background: oklch(0.35 0.05 85 / 0.3); border: 1px solid oklch(0.5 0.08 85 / 0.3); }
    .price-ai      { color: var(--purple); background: oklch(0.35 0.06 306 / 0.3); border: 1px solid oklch(0.5 0.08 306 / 0.3); }
    .price-free    { color: var(--green);  background: oklch(0.32 0.05 142 / 0.3); border: 1px solid oklch(0.5 0.08 142 / 0.3); }

    .card-desc {
      color: var(--muted-foreground);
      font-size: 0.85rem;
      margin-bottom: 1rem;
      font-family: var(--font-sans);
    }

    /* Routes */
    .routes { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }

    .route {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-family: var(--font-mono);
      font-size: 0.78rem;
    }

    .method { color: var(--green); font-weight: 700; min-width: 2.5rem; }
    .path { color: oklch(0.75 0 0); }
    .path .p { color: var(--blue); }

    /* Code blocks */
    .cmd {
      background: var(--muted);
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px);
      padding: 0.75rem 1rem;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--foreground);
      position: relative;
      overflow-x: auto;
      white-space: pre;
    }

    .cmd .dim   { color: var(--muted-foreground); }
    .cmd .kw    { color: var(--green); }
    .cmd .flag  { color: var(--purple); }
    .cmd .url   { color: var(--blue); }

    .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--muted-foreground);
      font-size: 0.7rem;
      padding: 0.18rem 0.5rem;
      cursor: pointer;
      font-family: var(--font-mono);
      transition: color 0.15s;
    }

    .copy-btn:hover { color: var(--foreground); }

    /* Divider */
    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 2.25rem 0;
    }

    /* Install card */
    .install-card {
      background: oklch(0.28 0.04 142 / 0.12);
      border: 1px solid oklch(0.5 0.1 142 / 0.25);
      border-radius: var(--radius);
      padding: 1.25rem 1.5rem;
    }

    .install-title {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.875rem;
      color: var(--green);
    }

    /* Footer */
    footer {
      margin-top: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    footer p { color: var(--muted-foreground); font-size: 0.8rem; font-family: var(--font-sans); }
    footer a { color: var(--blue); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-row">
        <h1>GitHub MPP Proxy</h1>
        <span class="live-badge"><span class="live-dot"></span>live</span>
      </div>
      <p class="subtitle">
        Access the GitHub API via <a href="https://tempo.xyz" target="_blank">Tempo</a> payments —
        no API keys, no accounts, pay per request with USDC.
        Built on the <a href="https://mpp.dev" target="_blank">Machine Payments Protocol</a>.
      </p>
    </header>

    <div class="section-label">GitHub Data</div>
    <div class="cards">
      <div class="card">
        <div class="card-top">
          <div class="card-title">🗂 Repos, Issues &amp; Pull Requests</div>
          <span class="price-tag price-default">$0.001 / request</span>
        </div>
        <p class="card-desc">Fetch repo metadata, list issues and PRs, browse commits, file contents, releases and contributors.</p>
        <div class="routes">
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="p">:owner</span>/<span class="p">:repo</span></span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="p">:owner</span>/<span class="p">:repo</span>/issues</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="p">:owner</span>/<span class="p">:repo</span>/pulls</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="p">:owner</span>/<span class="p">:repo</span>/commits</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="p">:owner</span>/<span class="p">:repo</span>/contributors</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/users/<span class="p">:username</span></span></div>
        </div>
        <div class="cmd"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dim">$ </span><span class="kw">tempo request</span> <span class="flag">-t</span> <span class="url">https://github.tempflow.xyz/github/repos/facebook/react</span></div>
      </div>

      <div class="card">
        <div class="card-top">
          <div class="card-title">🔍 Search</div>
          <span class="price-tag price-default">$0.002 / request</span>
        </div>
        <p class="card-desc">Search repositories, issues, code snippets, and users across all of GitHub.</p>
        <div class="routes">
          <div class="route"><span class="method">GET</span><span class="path">/github/search/repositories?q=<span class="p">query</span></span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/search/issues?q=<span class="p">query</span></span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/search/code?q=<span class="p">query</span></span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/search/users?q=<span class="p">query</span></span></div>
        </div>
        <div class="cmd"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dim">$ </span><span class="kw">tempo request</span> <span class="flag">-t</span> <span class="url">"https://github.tempflow.xyz/github/search/repositories?q=mppx"</span></div>
      </div>
    </div>

    <div class="section-label">AI Analysis — powered by Claude</div>
    <div class="cards">
      <div class="card">
        <div class="card-top">
          <div class="card-title">🤖 PR Code Review</div>
          <span class="price-tag price-ai">$0.010 / request</span>
        </div>
        <p class="card-desc">Fetch the full diff and get an AI-generated code review with a final verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION.</p>
        <div class="routes">
          <div class="route"><span class="method">GET</span><span class="path">/review/repos/<span class="p">:owner</span>/<span class="p">:repo</span>/pulls/<span class="p">:id</span></span></div>
        </div>
        <div class="cmd"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dim">$ </span><span class="kw">tempo request</span> <span class="flag">-t</span> <span class="url">https://github.tempflow.xyz/review/repos/vercel/next.js/pulls/91670</span></div>
      </div>

      <div class="card">
        <div class="card-top">
          <div class="card-title">📋 Issue Analysis</div>
          <span class="price-tag price-ai">$0.005 / request</span>
        </div>
        <p class="card-desc">Summarize an issue with all its comments, identify root cause, proposed solutions, and get a priority assessment.</p>
        <div class="routes">
          <div class="route"><span class="method">GET</span><span class="path">/analyze/repos/<span class="p">:owner</span>/<span class="p">:repo</span>/issues/<span class="p">:id</span></span></div>
        </div>
        <div class="cmd"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dim">$ </span><span class="kw">tempo request</span> <span class="flag">-t</span> <span class="url">https://github.tempflow.xyz/analyze/repos/facebook/react/issues/31716</span></div>
      </div>
    </div>

    <hr />

    <div class="install-card">
      <div class="install-title">⚡ Get started in 30 seconds</div>
      <div class="cmd"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dim"># Install Tempo CLI
$ </span><span class="kw">curl</span> <span class="flag">-fsSL</span> <span class="url">https://tempo.xyz/install</span> | bash

<span class="dim"># Login with your wallet
$ </span><span class="kw">tempo wallet login</span>

<span class="dim"># Make your first request
$ </span><span class="kw">tempo request</span> <span class="flag">-t</span> <span class="url">https://github.tempflow.xyz/github/repos/facebook/react</span></div>
    </div>

    <footer>
      <p>Built with <a href="https://mpp.dev" target="_blank">mppx</a> · <a href="https://tempo.xyz" target="_blank">Tempo</a> · <a href="https://workers.cloudflare.com" target="_blank">Cloudflare Workers</a></p>
      <p><a href="https://github.com/aLjTap/github-mpp-proxy" target="_blank">Source on GitHub</a> · <a href="/llms.txt">llms.txt</a> · <a href="/discover">API</a></p>
    </footer>
  </div>

  <script>
    function copy(btn) {
      const block = btn.parentElement;
      const text = block.innerText.replace(/^copy\\n/, '').trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'copied!';
        setTimeout(() => btn.textContent = 'copy', 1500);
      });
    }
  </script>
</body>
</html>`;
