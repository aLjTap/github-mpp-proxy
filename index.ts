import { custom, Proxy } from "mppx/proxy";
import { Mppx, tempo } from "mppx/server";
import type { Service } from "mppx/proxy";

type Env = {
  GITHUB_TOKEN: string;
  RECIPIENT: string;
  MPP_SECRET_KEY: string;
};

let proxy: { fetch: (req: Request) => Promise<Response> } | null = null;
let lastEnvKey = "";

function getProxy(env: Env) {
  const envKey = env.GITHUB_TOKEN + env.RECIPIENT + env.MPP_SECRET_KEY;
  if (proxy && envKey === lastEnvKey) return proxy;

  const mppx = Mppx.create({
    methods: [tempo({ recipient: env.RECIPIENT as `0x${string}` })],
    secretKey: env.MPP_SECRET_KEY,
  });

  const github = custom("github", {
    baseUrl: "https://api.github.com",
    title: "GitHub API",
    description: "GitHub REST API proxy with automatic payments via Tempo.",
    rewriteRequest(req) {
      req.headers.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
      req.headers.set("Accept", "application/vnd.github+json");
      req.headers.set("X-GitHub-Api-Version", "2022-11-28");
      req.headers.delete("host");
      return req;
    },
    routes: {
      "GET /repos/:owner/:repo":            mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/issues":     mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/issues/:id": mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/pulls":      mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/pulls/:id":  mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/commits":    mppx.charge({ amount: "0.001" }),
      "GET /repos/:owner/:repo/contents/*": mppx.charge({ amount: "0.001" }),
      "GET /users/:username":               mppx.charge({ amount: "0.001" }),
      "GET /users/:username/repos":         mppx.charge({ amount: "0.001" }),
      "GET /search/repositories":           mppx.charge({ amount: "0.002" }),
      "GET /search/issues":                 mppx.charge({ amount: "0.002" }),
      "GET /search/code":                   mppx.charge({ amount: "0.002" }),
      "GET /orgs/:org/repos":               mppx.charge({ amount: "0.001" }),
      "GET /rate_limit":                    true,
    },
  });

  proxy = Proxy.create({
    title: "GitHub MPP Proxy",
    description:
      "Access the GitHub REST API using Tempo payments. No GitHub token needed — pay per request.",
    services: [github],
  });

  lastEnvKey = envKey;
  return proxy;
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return getProxy(env).fetch(request);
  },
};
