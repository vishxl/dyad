# One-Shot Deployment: Dyad + OpenViking + Langfuse on Oracle Free Tier

Everything below runs on a fresh Oracle Cloud always-free ARM VM. Do steps in order; each has a verification. Commands assume Ubuntu 24.04 (aarch64).

**You'll need ready before starting:**
- [ ] Oracle account (you have it) + created VM (Step 1)
- [ ] OpenRouter API key (for OpenViking embeddings/VLM) — openrouter.ai/keys
- [ ] LLM provider key(s) for Dyad app generation (OpenRouter key works)
- [ ] A Google account to create the OAuth client (any personal Google account works; the client is what restricts sign-in to `@nextbillion.ai`)

---

## Step 0 — Create the VM (Oracle Console, ~10 min)

1. Console → **Networking → Virtual Cloud Networks** → pick the default VCN (or create one with the wizard, "auto-assign" everything).
2. **Compute → Instances → Create Instance**:
   - Image: **Ubuntu 24.04** (aarch64)
   - Shape: **VM.Standard.A1.Flex** → 4 OCPU / 24 GB (both are inside the always-free allowance; 2 OCPU/12GB also fine)
   - Add SSH keys: paste your `~/.ssh/id_ed25519.pub`
3. After it runs: **Instance details → Subnet → Security List → Add Ingress Rule**: source `0.0.0.0/0`, TCP, destination port **443**. Repeat for **80**. (SSH 22 usually exists already.)
4. Note the **Public IP**. Everything below calls it `$IP`.

Verify: `ssh ubuntu@$IP` works.

## Step 1 — Clone, provision, secrets (on the VM, ~20 min)

```bash
ssh ubuntu@$IP
sudo -i
# System deps (provision script also installs most of these)
apt update && apt -y install git curl build-essential python3
# Clone the deployment branch
mkdir -p /opt/dyad && cd /opt/dyad
git clone --branch web-deploy https://github.com/vishxl/dyad.git app
# Run the provisioner (installs Node 24 + caddy + oauth2-proxy, builds native
# modules, creates dyad user, generates deploy/env + cookie secret, writes
# /etc/caddy/Caddyfile, installs systemd units)
bash /opt/dyad/app/deploy/provision-vm.sh <IP-with-dashes>.sslip.io
# e.g. IP 123.45.67.89 → 123-45-67-89.sslip.io
```

The script prints remaining manual steps. Capture the RPC token it prints:
```bash
grep DYAD_RPC_TOKEN /opt/dyad/app/deploy/env   # save for curl probes
```

## Step 2 — Google OAuth client (browser, ~10 min)

1. https://console.cloud.google.com → create project "dyad-web" (free).
2. **APIs & Services → OAuth consent screen**: User type **External** → app name anything → add your own email as test user. (Scopes: `openid`, `email`, `profile` are defaults.)
3. **Credentials → Create Credentials → OAuth client ID → Web application**:
   - Authorized JavaScript origins: `https://<IP-with-dashes>.sslip.io`
   - Authorized redirect URIs: `https://<IP-with-dashes>.sslip.io/oauth2/callback`
4. Copy the **Client ID** and **Client Secret** into the config:
```bash
sed -i "s|REPLACE_WITH_GOOGLE_CLIENT_ID|<client-id>|"  /opt/dyad/app/deploy/oauth2-proxy.cfg
sed -i "s|REPLACE_WITH_GOOGLE_CLIENT_SECRET|<secret>|" /opt/dyad/app/deploy/oauth2-proxy.cfg
```
Note: Google may warn the hostname isn't a "real" domain — sslip.io works; click through. If the consent screen blocks it, publish the app (Console → OAuth consent screen → Publish App).

## Step 3 — OpenViking + context packs (~15 min)

```bash
# Python env via uv (installs its own Python 3.13)
sudo -u dyad bash -c 'curl -LsSf https://astral.sh/uv/install.sh | sh && ~/.local/bin/uv tool install openviking'
```

Config (`/opt/dyad/.openviking/ov.conf`, chmod 600) — same shape as your Mac's:
```bash
sudo -u dyad mkdir -p /opt/dyad/.openviking
sudo -u dyad tee /opt/dyad/.openviking/ov.conf > /dev/null <<'EOF'
< paste your Mac's ~/.openviking/ov.conf here — same OpenRouter embedding+vlm config >
EOF
```
(Just `scp ubuntu@$IP` it back up, or cat + paste. Keep `api_base: https://openrouter.ai/api/v1` and the same models: `openai/text-embedding-3-small` + `google/gemini-2.5-flash`.)

**Systemd unit** already exists in the repo (`deploy/openviking.service` points at `/usr/local/bin/openviking-server`). Fix the binary path for the uv install:
```bash
sed -i 's|ExecStart=/usr/local/bin/openviking-server|ExecStart=/opt/dyad/.local/bin/openviking-server|' /opt/dyad/app/deploy/openviking.service
```
(User `dyad` has home `/opt/dyad`, so `~/.local/bin` = `/opt/dyad/.local/bin`.)

**Ingest the NextBillion context** (from your Mac, or scp the corpus first):
```bash
# On your Mac:
scp -r /Users/vishal/openviking_nb ubuntu@$IP:/tmp/openviking_nb
# On the VM (as dyad user, server must be running first):
systemctl start openviking
sudo -u dyad bash /opt/dyad/app/scripts/openviking-ingest.sh /tmp/openviking_nb/context/nextbillion-docs viking://resources/nextbillion-docs
# Policy doc (single write, deterministic read-by-URI):
sudo -u dyad curl -s -X POST http://127.0.0.1:1933/api/v1/content/write \
  -H "Content-Type: application/json" \
  -d "{\"uri\": \"viking://resources/nextbillion-policy/index.md\", \"mode\": \"create\", \"wait\": true, \"content\": $(python3 -c 'import json;print(json.dumps(open("/tmp/openviking_nb/context/nextbillion-policy.md").read()))')}"
```
The 284-file corpus takes a while (embeddings via OpenRouter). Watch progress: the ingest script prints `root: ... | contexts: N` when done. Verify:
```bash
curl -s "http://127.0.0.1:1933/api/v1/content/read?uri=viking://resources/nextbillion-policy/index.md&raw=true" | head -c 200
```

## Step 4 — Langfuse (browser, ~5 min, no hosting)

1. https://cloud.langfuse.com → sign up (free tier, 50k units/mo).
2. Create **Organization → Project "dyad-web" → API Keys**.
3. Put them in the env file:
```bash
cat >> /opt/dyad/app/deploy/env <<'EOF'
LANGFUSE_BASE_URL=https://cloud.langfuse.com
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
EOF
```
Tracing then flows automatically (the branch's observability is Langfuse-native; first chat turns show up in the Langfuse UI).

## Step 5 — Boot everything (~2 min)

```bash
systemctl daemon-reload
systemctl enable --now caddy oauth2-proxy openviking dyad-web
systemctl status --no-pager dyad-web caddy oauth2-proxy openviking | grep -E "Active:"
```

## Step 6 — Verify (each command has its expected result)

```bash
# 1. TLS + auth redirect (expect: HTTP/2 302, location → accounts.google.com)
curl -sI https://<IP-with-dashes>.sslip.io/ | head -3

# 2. Token gate behind proxy (expect: 403)
curl -s -X POST https://<IP-with-dashes>.sslip.io/rpc/list-apps | head -c 80

# 3. RPC with token, no Origin (expect: {"__dyadIpcEnvelope":...,"ok":...)
curl -s -X POST https://<IP-with-dashes>.sslip.io/rpc/list-apps \
  -H "x-dyad-rpc-token: <token-from-step-1>" -H "Content-Type: application/json" -d '{}' | head -c 120

# 4. OpenViking healthy (expect: 200 ok)
curl -s http://127.0.0.1:1933/health

# 5. Langfuse wired (first chat after this appears at cloud.langfuse.com)
grep LANGFUSE /opt/dyad/app/deploy/env
```

Then in a browser: open `https://<IP-with-dashes>.sslip.io` → Google sign-in (only `@nextbillion.ai` accepted) → Dyad UI loads → configure provider keys in Settings (one-time, shared pool) → create an app → confirm the preview iframe URL is `https://<IP-with-dashes>.sslip.io/preview/<port>/...`.

## Troubleshooting quick map

| Symptom | Check |
|---|---|
| No TLS cert issued | `journalctl -u caddy -f` — Let's Encrypt rate limits on sslip.io; retry in an hour or use your own domain |
| 502 on `/` | `systemctl status dyad-web` + `journalctl -u dyad-web -n 50` (most common: native module rebuild missed — rerun `cd /opt/dyad/app && npm rebuild better-sqlite3 dugite electron`) |
| Sign-in loops | redirect URI in Google console must be **exactly** `https://<host>/oauth2/callback`; cookie secret file present (`/opt/dyad/app/deploy/oauth2-cookie-secret.inc`) |
| Context pack empty in prompts | `journalctl -u openviking -n 30`; corpus ingestion finished? (`contexts: N` line) |
| Preview iframe blank | `journalctl -u dyad-web | grep proxy-server-start` — check the public-url line; app dev server may need `restart-app` (chat message "restart the app") |
| RPC 403 with token | token in `deploy/env` vs header must match exactly; check you're hitting `/rpc/*` not the UI |

## What's shared vs isolated (phase-1 recap)

One workspace, one settings/key store (keys plaintext at `/opt/dyad/deploy-userData/settings.json` — anyone signed in can read them via Settings; keep this in mind with teammates), all live events fan out to every browser, one shared 1000-msg/23h basic-agent quota pool. OAuth restricts *who* (`@nextbillion.ai`), not *what they see*. Phase-2 isolation path is in `context/dyad-web-deployment.md` §9.