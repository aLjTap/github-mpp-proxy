export type Env = {
  GITHUB_TOKEN: string;
  RECIPIENT: string;
  MPP_SECRET_KEY: string;
  ANTHROPIC_API_KEY: string;
};

export const USDC = "0x20C000000000000000000000b9537d11c60E8b50" as const;

export const GH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "github-mpp-proxy/1.0",
});

// The charge function type: amount → intent handler
export type ChargeFn = (amount: string) => (req: Request) => Promise<
  | { status: 402; challenge: Response }
  | { status: 200; withReceipt: <T>(res: T) => T }
>;
