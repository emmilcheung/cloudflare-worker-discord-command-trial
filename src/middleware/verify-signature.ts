import type { Context, Next } from 'hono';
import { verifyKey } from 'discord-interactions';
import type { HonoEnv } from '../types';

/**
 * Hono middleware: verifies Discord Ed25519 signature on every POST.
 * Returns 401 if invalid. Stores parsed body in c.set('interaction').
 *
 * Discord requires signature verification on all interaction endpoints:
 * https://discord.com/developers/docs/interactions/overview#setting-up-an-endpoint
 *
 * Signature headers:
 *   x-signature-ed25519  — Ed25519 signature of timestamp + body
 *   x-signature-timestamp — Unix timestamp of the request
 * https://discord.com/developers/docs/interactions/overview#setting-up-an-endpoint-validating-security-request-headers
 */
export async function verifyDiscordSignature(c: Context<HonoEnv>, next: Next) {
  const signature = c.req.header('x-signature-ed25519') ?? '';
  const timestamp = c.req.header('x-signature-timestamp') ?? '';
  const rawBody = await c.req.text();

  const isValid = await verifyKey(rawBody, signature, timestamp, c.env.DISCORD_PUBLIC_KEY);
  if (!isValid) {
    return c.text('Invalid request signature', 401);
  }

  c.set('interaction', JSON.parse(rawBody));
  await next();
}
