import { getInstances } from "./src/proxy";
import { handlePRReview } from "./src/handlers/review";
import { handleIssueAnalysis } from "./src/handlers/issue";
import { html } from "./src/ui";
import { ogSvg } from "./src/og";
import type { Env } from "./src/types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { charge, proxy } = getInstances(env);
    const { pathname } = new URL(request.url);

    if (pathname === "/" || pathname === "")
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });

    if (pathname === "/og.png")
      return new Response(ogSvg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });

    if (pathname.startsWith("/review/"))  return handlePRReview(request, env, charge);
    if (pathname.startsWith("/analyze/")) return handleIssueAnalysis(request, env, charge);

    return proxy.fetch(request);
  },
};
