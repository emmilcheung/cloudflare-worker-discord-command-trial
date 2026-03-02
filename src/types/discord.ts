// Discord Interaction Types
// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
export const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
} as const;

// Discord Interaction Response Types
// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
export const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
} as const;

// Discord Interaction Object
// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
export interface DiscordInteraction {
  type: number;
  id: string;
  token: string;
  data?: {
    name: string;
    options?: { name: string; value: string }[];
  };
  member?: {
    user: {
      id: string;
      username: string;
    };
  };
  channel_id?: string;
  guild_id?: string;
}
