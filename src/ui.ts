export const html = /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GitHub MPP Proxy</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --border: #30363d;
      --text: #e6edf3;
      --muted: #8b949e;
      --green: #3fb950;
      --blue: #58a6ff;
      --purple: #bc8cff;
      --orange: #ffa657;
      --yellow: #e3b341;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      line-height: 1.6;
      padding: 2rem 1rem;
    }

    .container { max-width: 860px; margin: 0 auto; }

    header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    header h1 {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      background: #1f2d1f;
      color: var(--green);
      border: 1px solid #2ea04322;
    }

    .badge::before { content: "●"; font-size: 0.6rem; }

    .subtitle {
      color: var(--muted);
      font-size: 0.95rem;
      margin-bottom: 2.5rem;
    }

    .subtitle a { color: var(--blue); text-decoration: none; }
    .subtitle a:hover { text-decoration: underline; }

    .section-title {
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      margin-bottom: 0.75rem;
      margin-top: 2rem;
    }

    .cards { display: grid; gap: 1rem; }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.4rem;
    }

    .card-title {
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--yellow);
      background: #2d2a1a;
      border: 1px solid #4a400022;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }

    .price.free { color: var(--green); background: #1a2d1a; }

    .card-desc {
      color: var(--muted);
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    .cmd-block {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.75rem 1rem;
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 0.8rem;
      color: var(--text);
      position: relative;
      overflow-x: auto;
      white-space: pre;
    }

    .cmd-block .dollar { color: var(--muted); user-select: none; }
    .cmd-block .cmd { color: var(--green); }
    .cmd-block .flag { color: var(--purple); }
    .cmd-block .url { color: var(--blue); }

    .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--muted);
      font-size: 0.72rem;
      padding: 0.2rem 0.5rem;
      cursor: pointer;
      font-family: inherit;
      transition: color 0.15s;
    }

    .copy-btn:hover { color: var(--text); }

    .routes {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      margin-bottom: 1rem;
    }

    .route {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 0.78rem;
    }

    .method {
      color: var(--green);
      font-weight: 700;
      min-width: 2.5rem;
    }

    .path { color: var(--blue); }
    .path .param { color: var(--orange); }

    .divider {
      border: none;
      border-top: 1px solid var(--border);
      margin: 2rem 0;
    }

    .install-section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
    }

    .install-title {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    footer {
      margin-top: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    footer p { color: var(--muted); font-size: 0.82rem; }
    footer a { color: var(--blue); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>GitHub MPP Proxy</h1>
      <span class="badge">live</span>
    </header>
    <p class="subtitle">
      Access the GitHub API and AI-powered code analysis via
      <a href="https://tempo.xyz" target="_blank">Tempo</a> payments.
      No API keys. No accounts. Pay per request.
    </p>

    <div class="section-title">GitHub Data</div>
    <div class="cards">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗂 Repositories, Issues & PRs</div>
          <span class="price">$0.001 / request</span>
        </div>
        <p class="card-desc">Fetch repo metadata, list issues and pull requests, browse commits and file contents.</p>
        <div class="routes">
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="param">:owner</span>/<span class="param">:repo</span></span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="param">:owner</span>/<span class="param">:repo</span>/issues</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="param">:owner</span>/<span class="param">:repo</span>/pulls</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="param">:owner</span>/<span class="param">:repo</span>/commits</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/repos/<span class="param">:owner</span>/<span class="param">:repo</span>/contributors</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/users/<span class="param">:username</span></span></div>
        </div>
        <div class="cmd-block"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dollar">$ </span><span class="cmd">tempo request</span> <span class="flag">-t</span> <span class="url">https://github.tempflow.xyz/github/repos/facebook/react</span></div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🔍 Search</div>
          <span class="price">$0.002 / request</span>
        </div>
        <p class="card-desc">Search repositories, issues, code, and users across all of GitHub.</p>
        <div class="routes">
          <div class="route"><span class="method">GET</span><span class="path">/github/search/repositories?q=<span class="param">query</span></span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/search/issues?q=<span class="param">query</span></span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/search/code?q=<span class="param">query</span></span></div>
          <div class="route"><span class="method">GET</span><span class="path">/github/search/users?q=<span class="param">query</span></span></div>
        </div>
        <div class="cmd-block"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dollar">$ </span><span class="cmd">tempo request</span> <span class="flag">-t</span> <span class="url">"https://github.tempflow.xyz/github/search/repositories?q=mppx"</span></div>
      </div>
    </div>

    <div class="section-title">AI Analysis — powered by Claude</div>
    <div class="cards">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🤖 PR Code Review</div>
          <span class="price">$0.010 / request</span>
        </div>
        <p class="card-desc">Fetch the full diff of a pull request and get an AI-generated code review with a verdict.</p>
        <div class="routes">
          <div class="route"><span class="method">GET</span><span class="path">/review/repos/<span class="param">:owner</span>/<span class="param">:repo</span>/pulls/<span class="param">:id</span></span></div>
        </div>
        <div class="cmd-block"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dollar">$ </span><span class="cmd">tempo request</span> <span class="flag">-t</span> <span class="url">https://github.tempflow.xyz/review/repos/vercel/next.js/pulls/91670</span></div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">📋 Issue Analysis</div>
          <span class="price">$0.005 / request</span>
        </div>
        <p class="card-desc">Summarize an issue with its comments, identify root cause, and get a priority assessment.</p>
        <div class="routes">
          <div class="route"><span class="method">GET</span><span class="path">/analyze/repos/<span class="param">:owner</span>/<span class="param">:repo</span>/issues/<span class="param">:id</span></span></div>
        </div>
        <div class="cmd-block"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dollar">$ </span><span class="cmd">tempo request</span> <span class="flag">-t</span> <span class="url">https://github.tempflow.xyz/analyze/repos/facebook/react/issues/31716</span></div>
      </div>
    </div>

    <hr class="divider" />

    <div class="install-section">
      <div class="install-title">⚡ Get started in 30 seconds</div>
      <div class="cmd-block" style="margin-bottom:0.75rem"><button class="copy-btn" onclick="copy(this)">copy</button><span class="dollar"># </span>Install Tempo CLI
<span class="dollar">$ </span><span class="cmd">curl</span> <span class="flag">-fsSL</span> <span class="url">https://tempo.xyz/install</span> | bash

<span class="dollar"># </span>Login with your wallet
<span class="dollar">$ </span><span class="cmd">tempo wallet login</span>

<span class="dollar"># </span>Make your first request
<span class="dollar">$ </span><span class="cmd">tempo request</span> <span class="flag">-t</span> <span class="url">https://github.tempflow.xyz/github/repos/facebook/react</span></div>
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
