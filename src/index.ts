/**
 * Discord Agent Bot — Cloudflare Worker with Hono
 */

import { Hono } from 'hono';
import type { HonoEnv, DiscordInteraction } from './types';
import { InteractionType, InteractionResponseType } from './types';
import { verifyDiscordSignature } from './middleware/verify-signature';
import { handleAgent } from './commands/agent';

const app = new Hono<HonoEnv>();

// Health check
app.get('/', (c) => c.text('Discord Agent Bot is running.'));

// Discord interactions endpoint — signature verified via middleware
app.post('/', verifyDiscordSignature, (c) => {
  const interaction = c.get('interaction') as DiscordInteraction;

  // PING — Discord verification handshake
  if (interaction.type === InteractionType.PING) {
    return c.json({ type: InteractionResponseType.PONG });
  }

  // Slash command invoked
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const commandName = interaction.data?.name;

    switch (commandName) {
      case 'agent':
        return handleAgent(c, interaction);
      // Add more commands here:
      // case 'summarize':
      //   return handleSummarize(c, interaction);
      default:
        return c.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `Unknown command: /${commandName}` },
        });
    }
  }

  return c.json({ error: 'Unknown interaction type' }, 400);
});

export default app;
