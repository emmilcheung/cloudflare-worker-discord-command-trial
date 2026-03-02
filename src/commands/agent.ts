import type { Context } from 'hono';
import type { Env, DiscordInteraction, HonoEnv } from '../types';
import { InteractionResponseType } from '../types';
import { callLLM } from '../services/llm';
import { editOriginalResponse } from '../services/discord';

/**
 * Handle /agent slash command.
 * Returns a deferred response immediately, then calls LLM in the background.
 */
export function handleAgent(c: Context<HonoEnv>, interaction: DiscordInteraction): Response {
  const userMessage = interaction.data?.options?.find((o) => o.name === 'message')?.value ?? '';
  const username = interaction.member?.user?.username ?? 'unknown';

  // Background work: call LLM → edit deferred message
  c.executionCtx.waitUntil(processAgentRequest(c.env, interaction.token, username, userMessage));

  return c.json({ type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE });
}

async function processAgentRequest(
  env: Env,
  interactionToken: string,
  username: string,
  userMessage: string,
): Promise<void> {
  try {
    const llmReply = await callLLM(env, username, userMessage);
    await editOriginalResponse(env, interactionToken, llmReply);
  } catch (err) {
    console.error('Agent error:', err);
    await editOriginalResponse(env, interactionToken, '⚠️ Sorry, something went wrong with the agent.');
  }
}
