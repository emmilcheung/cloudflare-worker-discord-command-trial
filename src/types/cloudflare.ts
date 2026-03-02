// Cloudflare Worker environment bindings
// https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/#parameters
// Secrets are set via: `npx wrangler secret put <NAME>`
export interface Env {
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APP_ID: string;
  DISCORD_BOT_TOKEN: string;
  LLM_API_KEY: string;
}

// Hono env binding for typed c.env access
// https://hono.dev/docs/getting-started/cloudflare-workers#bindings
export type HonoEnv = { Bindings: Env };
