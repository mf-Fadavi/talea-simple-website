# VPS deployment: Dify (AI chatbot) + PostHog (analytics)

This guide deploys the two self-hosted services the website integrates with
(see `components/integrations/`). Everything runs on one Linux VPS behind a
single Caddy reverse proxy that handles HTTPS automatically.

```
Browser
  │
  ├─ https://analytics.example.com ─┐
  ├─ https://chat.example.com ──────┤
  ▼                                 ▼
Caddy (ports 80/443, auto-TLS via Let's Encrypt)
  ├─→ 127.0.0.1:8010 → PostHog stack (its bundled proxy + ~30 services)
  └─→ 127.0.0.1:8180 → Dify stack (nginx + api/worker/web/db/redis/...)
```

Replace `example.com` with your real domain everywhere below.

## 1. Prerequisites

- **VPS**: Ubuntu 22.04/24.04. PostHog's hobby deployment officially needs
  **4 vCPU / 16 GB RAM / 30+ GB disk**; Dify adds ~2–4 GB on top. A Hetzner
  CPX41 (or similar, roughly €25–30/month) runs both comfortably.
  - If that's more than you want to spend, the lightweight alternative is
    replacing PostHog with Umami (runs on a 2 GB VPS) — but you lose
    heatmaps and autocapture, keeping only tagged click events.
- **DNS**: two A records pointing at the VPS IP, created *before* installing
  (Let's Encrypt validates them): `analytics.example.com` and
  `chat.example.com`.
- **An LLM API key** for Dify (Anthropic, OpenAI, ...), or Ollama if you want
  a fully local model.

## 2. Base server setup

```bash
# as root on the fresh VPS
apt update && apt upgrade -y

# firewall — only SSH and HTTP(S) exposed
apt install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Docker + Compose plugin (official convenience script)
curl -fsSL https://get.docker.com | sh
docker compose version   # needs v2.24+ for the override files below
```

## 3. PostHog

Install order matters: PostHog first, while ports 80/443 are still free —
its installer briefly uses them.

```bash
cd /opt
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/posthog/posthog/HEAD/bin/deploy-hobby)"
# When prompted:
#   - version tag: latest
#   - domain: analytics.example.com
```

Wait 5–10 minutes, then verify `https://analytics.example.com` loads and
create your admin account. Now move it behind the shared proxy:

```bash
cd /opt/posthog   # wherever deploy-hobby cloned to

# 1. copy deploy/posthog/docker-compose.override.yml from this repo
#    next to docker-compose.yml

# 2. edit .env — change/add these lines:
#    CADDY_HOST=http://analytics.example.com:80
#    CADDY_TLS_BLOCK=
#    IS_BEHIND_PROXY=True
#    TRUST_ALL_PROXIES=True   # safe: port 8010 is loopback-only

docker compose up -d
```

`TRUST_ALL_PROXIES=True` is acceptable here because the override binds
PostHog to 127.0.0.1 only — nothing but the local Caddy can reach it.

## 4. Front proxy (Caddy)

```bash
mkdir -p /opt/caddy && cd /opt/caddy
# copy deploy/caddy/docker-compose.yml and deploy/caddy/Caddyfile here,
# then put your real domains into the Caddyfile
docker compose up -d
```

`https://analytics.example.com` should now be served by this Caddy (check
`docker compose logs -f caddy` for certificate issuance). If PostHog loops
in a redirect, its `.env` is missing `IS_BEHIND_PROXY=True` — as a last
resort `DISABLE_SECURE_SSL_REDIRECT=True` also stops the loop.

## 5. Dify

```bash
cd /opt
git clone https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
# copy deploy/dify/docker-compose.override.yml from this repo into this dir

# edit .env — set the public URL everywhere so links, uploaded files and the
# embed script resolve correctly:
#   CONSOLE_API_URL=https://chat.example.com
#   CONSOLE_WEB_URL=https://chat.example.com
#   SERVICE_API_URL=https://chat.example.com
#   APP_API_URL=https://chat.example.com
#   APP_WEB_URL=https://chat.example.com
#   FILES_URL=https://chat.example.com

docker compose up -d
```

Open `https://chat.example.com/install`, create the admin account, then:

1. **Settings → Model Provider** — add your LLM API key.
2. **Knowledge** — create a knowledge base; upload your documents/FAQ or
   crawl the website. Re-uploading or editing here is how you "retrain":
   the bot uses the updated content immediately.
3. **Studio → Create App → Chatbot** — write the system prompt (persona,
   tone, rules), attach the knowledge base as Context.
4. Optional speech: in the app's features enable Speech-to-Text /
   Text-to-Speech (requires a provider that offers those models, e.g.
   OpenAI Whisper/TTS).
5. **Publish → Embed on website** — copy the token from the script snippet
   (the `id`/`token` value, not the whole snippet).

## 6. Connect the website

In the GitHub repo → Settings → Secrets and variables → Actions →
**Variables**, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://analytics.example.com` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → Settings → Project → Project API key (`phc_...`) |
| `NEXT_PUBLIC_DIFY_BASE_URL` | `https://chat.example.com` |
| `NEXT_PUBLIC_DIFY_TOKEN` | the embed token from step 5.5 |

Re-run the "Deploy to GitHub Pages" workflow. The chat bubble appears on
every page, and PostHog starts autocapturing pageviews, clicks, and heatmap
data (Toolbar → Heatmaps, or the Web Analytics dashboard).

## 7. Updates

```bash
# PostHog
cd /opt/posthog && ./bin/upgrade-hobby   # their official upgrade script

# Dify — check their release notes for migration steps first
cd /opt/dify && git pull
cd docker && docker compose pull && docker compose up -d

# Caddy
cd /opt/caddy && docker compose pull && docker compose up -d
```

## 8. Backups

The state worth backing up:

- **Dify**: `dify/docker/volumes/` (Postgres data, uploaded files, vector
  DB) and its `.env`.
- **PostHog**: its Postgres + ClickHouse volumes and `.env`. For a small
  site, a nightly `tar` of the volumes while containers are stopped, or a
  Hetzner snapshot of the whole VPS, is the pragmatic option.

## Troubleshooting

- **Port 80/443 already in use** when starting Caddy → PostHog's proxy is
  still bound to them; confirm the override file is next to its
  docker-compose.yml and `docker compose up -d` was re-run (needs Compose
  v2.24+ for `!override`).
- **PostHog 401s or wrong client IPs** → check `IS_BEHIND_PROXY` /
  `TRUST_ALL_PROXIES` in its `.env`.
- **Dify embed loads but API calls fail** → the `*_URL` values in Dify's
  `.env` don't match `https://chat.example.com` (rebuild the web container
  after changing them: `docker compose up -d --force-recreate web`).
- **No analytics events arriving** → ad blockers block many self-hosted
  PostHog paths too; test in a clean browser profile first.
