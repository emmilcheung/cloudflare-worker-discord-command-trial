import type { Env } from '../types';

/**
 * Call an OpenAI-compatible LLM API.
 * Swap the URL/body for Anthropic, Groq, Together, etc.
 */
export async function callLLM(env: Env, username: string, userMessage: string): Promise<string> {
  // ---- Option A: OpenAI-compatible (OpenAI, Groq, Together, etc.) ----
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${env.LLM_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4o-mini',
  //     messages: [
  //       {
  //         role: 'system',
  //         content:
  //           'You are a helpful assistant in a Discord server. Keep responses concise (under 2000 chars for Discord limit).',
  //       },
  //       {
  //         role: 'user',
  //         content: `[${username}]: ${userMessage}`,
  //       },
  //     ],
  //     max_tokens: 1024,
  //   }),
  // });

  // ---- Option B: Anthropic (uncomment and swap) ----
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.LLM_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You are a helpful assistant in a Discord server. Keep responses concise.',
      messages: [{ role: 'user', content: `[${username}]: ${userMessage}` }],
    }),
  });

  const data = (await response.json()) as Record<string, any>;

  if (!response.ok) {
    console.error('LLM API error:', JSON.stringify(data));
    throw new Error(`LLM API returned ${response.status}`);
  }

  // // OpenAI format
  // return data.choices?.[0]?.message?.content ?? 'No response from the agent.';
  

  // Anthropic format (use if Option B)
  return data.content?.[0]?.text ?? 'No response from the agent.';

  // // first return some plain text for discord bot to reply with, then we can add more complex logic like parsing JSON for tool calls, etc.
  // return `Echoing your message: ${userMessage}`;
}
