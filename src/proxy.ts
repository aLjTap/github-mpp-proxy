import { custom, Proxy } from "mppx/proxy";
import { Mppx, tempo } from "mppx/server";
import { USDC, type ChargeFn, type Env } from "./types";

type ProxyInstance = { fetch: (req: Request) => Promise<Response> };

let cachedCharge: ChargeFn | null = null;
let cachedProxy: ProxyInstance | null = null;
let lastEnvKey = "";

export function getInstances(env: Env): { charge: ChargeFn; proxy: ProxyInstance } {
  const envKey = env.GITHUB_TOKEN + env.RECIPIENT + env.MPP_SECRET_KEY;
  if (cachedCharge && cachedProxy && envKey === lastEnvKey) {
    return { charge: cachedCharge, proxy: cachedProxy };
  }

  const mppx = Mppx.create({
    methods: [tempo({ recipient: env.RECIPIENT as `0x${string}`, currency: USDC })],
    secretKey: env.MPP_SECRET_KEY,
  });

  const charge: ChargeFn = (amount) => mppx.tempo.charge({ amount, currency: USDC }) as ReturnType<ChargeFn>;

  const github = custom("github", {
    baseUrl: "https://api.github.com",
    title: "GitHub API",
    description: "GitHub REST API — repos, issues, PRs, search, users.",
    rewriteRequest(req) {
      req.headers.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
      req.headers.set("Accept", "application/vnd.github+json");
      req.headers.set("X-GitHub-Api-Version", "2022-11-28");
      req.headers.set("User-Agent", "github-mpp-proxy/1.0");
      req.headers.delete("host");
      return req;
    },
    routes: {
      "GET /repos/:owner/:repo":              charge("0.001"),
      "GET /repos/:owner/:repo/issues":       charge("0.001"),
      "GET /repos/:owner/:repo/issues/:id":   charge("0.001"),
      "GET /repos/:owner/:repo/pulls":        charge("0.001"),
      "GET /repos/:owner/:repo/pulls/:id":    charge("0.001"),
      "GET /repos/:owner/:repo/commits":      charge("0.001"),
      "GET /repos/:owner/:repo/contents/*":   charge("0.001"),
      "GET /repos/:owner/:repo/readme":       charge("0.001"),
      "GET /repos/:owner/:repo/releases":     charge("0.001"),
      "GET /repos/:owner/:repo/contributors": charge("0.001"),
      "GET /repos/:owner/:repo/stargazers":   charge("0.001"),
      "GET /repos/:owner/:repo/topics":       charge("0.001"),
      "GET /users/:username":                 charge("0.001"),
      "GET /users/:username/repos":           charge("0.001"),
      "GET /orgs/:org/repos":                 charge("0.001"),
      "GET /search/repositories":             charge("0.002"),
      "GET /search/issues":                   charge("0.002"),
      "GET /search/code":                     charge("0.002"),
      "GET /search/users":                    charge("0.002"),
      "GET /rate_limit":                      true,
    },
  });

  const ai = custom("ai", {
    baseUrl: "https://github.tempflow.xyz",
    title: "GitHub AI",
    description: "AI-powered PR review and issue analysis using Claude.",
    rewriteRequest: (req) => req,
    routes: {
      "GET /review/repos/:owner/:repo/pulls/:id":    charge("0.01"),
      "GET /analyze/repos/:owner/:repo/issues/:id":  charge("0.005"),
    },
  });

  const proxy = Proxy.create({
    title: "GitHub MPP Proxy",
    description: "GitHub REST API + AI-powered PR reviews and issue analysis via Tempo payments.",
    services: [github, ai],
  });

  cachedCharge = charge;
  cachedProxy = proxy;
  lastEnvKey = envKey;
  return { charge, proxy };
}
