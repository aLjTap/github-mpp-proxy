export const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3fb950" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#58a6ff" stop-opacity="0.05"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Border -->
  <rect x="1" y="1" width="1198" height="628" rx="0" fill="none" stroke="#30363d" stroke-width="2"/>

  <!-- Top accent line -->
  <rect x="0" y="0" width="1200" height="3" fill="#3fb950"/>

  <!-- GitHub icon (octocat simplified) -->
  <text x="88" y="200" font-size="80" fill="#58a6ff" font-family="monospace">&#123; &#125;</text>

  <!-- Title -->
  <text x="88" y="310" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="72" font-weight="700" fill="#e6edf3">GitHub MPP Proxy</text>

  <!-- Subtitle -->
  <text x="88" y="385" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="32" fill="#8b949e">Access the GitHub API via Tempo payments.</text>
  <text x="88" y="430" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="32" fill="#8b949e">No API keys. No accounts. Pay per request.</text>

  <!-- Feature pills -->
  <rect x="88" y="490" width="230" height="52" rx="26" fill="#1f2d1f" stroke="#3fb950" stroke-width="1.5"/>
  <text x="203" y="522" font-family="monospace" font-size="22" fill="#3fb950" text-anchor="middle">Repo data  $0.001</text>

  <rect x="334" y="490" width="240" height="52" rx="26" fill="#1f2d1f" stroke="#3fb950" stroke-width="1.5"/>
  <text x="454" y="522" font-family="monospace" font-size="22" fill="#3fb950" text-anchor="middle">PR review  $0.010</text>

  <rect x="590" y="490" width="270" height="52" rx="26" fill="#1f2d1f" stroke="#3fb950" stroke-width="1.5"/>
  <text x="725" y="522" font-family="monospace" font-size="22" fill="#3fb950" text-anchor="middle">Issue analysis  $0.005</text>

  <!-- URL -->
  <text x="1112" y="588" font-family="monospace" font-size="24" fill="#58a6ff" text-anchor="end">github.tempflow.xyz</text>

  <!-- Powered by -->
  <text x="88" y="590" font-family="-apple-system, sans-serif" font-size="22" fill="#444d56">Powered by Tempo · Machine Payments Protocol</text>
</svg>`;
