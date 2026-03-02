import type { Env } from '../types';

// Discord API version used throughout this service.
// Changelog: https://discord.com/developers/docs/reference#api-versioning
const DISCORD_API_VERSION = 'v10';
const DISCORD_API_BASE = `https://discord.com/api/${DISCORD_API_VERSION}`;

// Discord message content limit (2000 characters for regular messages).
// https://discord.com/developers/docs/resources/message#create-message-jsonform-params
const DISCORD_MESSAGE_CHAR_LIMIT = 2000;

/**
 * Edit the deferred "Bot is thinking..." message with the actual reply.
 *
 * Uses the "Edit Original Interaction Response" endpoint:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response
 *
 * Endpoint: PATCH /webhooks/{application.id}/{interaction.token}/messages/@original
 * https://discord.com/developers/docs/resources/webhook#edit-webhook-message
 *
 * The interaction token is valid for 15 minutes after the initial response.
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-callback
 */
export async function editOriginalResponse(
  env: Env,
  interactionToken: string,
  content: string,
): Promise<void> {
  if (content.length > DISCORD_MESSAGE_CHAR_LIMIT) {
    content = content.slice(0, DISCORD_MESSAGE_CHAR_LIMIT - 3) + '...';
  }

  // https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response
  const url = `${DISCORD_API_BASE}/webhooks/${env.DISCORD_APP_ID}/${interactionToken}/messages/@original`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    console.error('Failed to edit response:', await response.text());
  }
}
