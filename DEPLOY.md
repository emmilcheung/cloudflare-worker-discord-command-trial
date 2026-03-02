# Discord Agent Bot — Deployment Guide

## Prerequisites

1. **Discord Application** — https://discord.com/developers/applications
2. **Cloudflare Account** — https://dash.cloudflare.com/sign-up (free plan works)
3. **Node.js** ≥ 20

---

## Step 1: Get Discord Credentials

From Discord Developer Portal → Your App:

- **Application ID** → General Information → Application ID
- **Public Key** → General Information → Public Key
- **Bot Token** → Bot → Reset Token (copy it, shown only once)

---

## Step 2: Install Dependencies

```bash
cd discord-agent-bot
yarn install
```

---

## Step 3: Login to Cloudflare

```bash
npx wrangler login
```

Opens a browser to authenticate. Free plan is sufficient.

---

## Step 4: Set Secrets

```bash
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_APP_ID
npx wrangler secret put DISCORD_BOT_TOKEN
npx wrangler secret put LLM_API_KEY
```

---

## Step 5: Deploy

```bash
yarn run deploy
```

Outputs a URL like: `https://discord-agent-bot.<your-subdomain>.workers.dev`

---

## Step 6: Set Interactions Endpoint in Discord

1. Discord Developer Portal → Your App → General Information
2. Paste Worker URL into **"Interactions Endpoint URL"**
3. Save — Discord sends a PING to verify

---

## Step 7: Register Slash Commands

```bash
DISCORD_APP_ID=your_app_id \
DISCORD_BOT_TOKEN=your_bot_token \
yarn run register-commands
```

For instant registration in a specific server:

```bash
DISCORD_APP_ID=your_app_id \
DISCORD_BOT_TOKEN=your_bot_token \
DISCORD_GUILD_ID=your_guild_id \
yarn run register-commands
```

---

## Step 8: Invite Bot to Your Server

```
https://discord.com/oauth2/authorize?client_id=YOUR_APP_ID&scope=applications.commands+bot
```

---

## Step 9: Test

```
/agent message:Hello, what can you do?
```

---

## Local Development

```bash
yarn run dev           # runs at http://localhost:8787
cloudflared tunnel --url http://localhost:8787   # expose to Discord
```

---

## Cost (Free Tier)

| Service            | Free Tier              |
|--------------------|------------------------|
| Cloudflare Workers | 100,000 requests/day   |
| Discord API        | Free                   |
| LLM API            | Varies by provider     |
