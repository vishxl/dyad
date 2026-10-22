# Deploy Dyad + OpenViking + Langfuse on Oracle — step by step

Follow top to bottom. Copy-paste the commands. Replace these two things whenever you see them:

- `123.45.67.89` = your VM's public IP
- `123-45-67-89.sslip.io` = same IP with **dots → dashes** (this is your URL)

Get from your Mac: your OpenRouter key (openrouter.ai/keys). That's the only credential you need upfront.

---

## PART A — Create the VM (browser, 10 min)

1. Log in to https://cloud.oracle.com
2. Top-left menu → **Compute → Instances → Create Instance**
   - Name: `dyad-web`
   - Image: click **Change image** → **Ubuntu 24.04** (keep "aarch64" — don't pick x86)
   - Shape: **VM.Standard.A1.Flex**, set **4 OCPU / 24 GB**
   - SSH keys: **Paste a public key** → on your Mac run `cat ~/.ssh/id_ed25519.pub`, paste the output. (If no key exists: `ssh-keygen -t ed25519` first.)
3. Click **Create**. Wait until it shows **RUNNING**.
4. Open ports — click the instance → click the **Subnet** link → click the **Default Security List** → **Add Ingress Rules**, add BOTH:
   - Source `0.0.0.0/0`, IP Protocol **TCP**, Destination Port **443**
   - Source `0.0.0.0/0`, IP Protocol **TCP**, Destination Port **80**
5. Copy the **Public IP address** from the instance page.

✅ Check: on your Mac, `ssh ubuntu@123.45.67.89` — you should get in without a password prompt.

---

## PART B — One script installs Dyad + Caddy + auth (VM, ~20 min, mostly waiting)

6. You're SSH'd in as `ubuntu`. Become root:

```bash
sudo -i
```

7. Install everything with one script:

```bash
apt update && apt -y install git curl build-essential python3
mkdir -p /opt/dyad && cd /opt/dyad
git clone --branch web-deploy https://github.com/vishxl/dyad.git app
bash app/deploy/provision-vm.sh 123-45-67-89.sslip.io
```

This takes ~15 min (installs Node 24, Caddy, oauth2-proxy, builds dependencies). At the end it prints your **RPC token** — copy it somewhere. (It's also in `/opt/dyad/app/deploy/env` if you lose it: `grep DYAD_RPC_TOKEN /opt/dyad/app/deploy/env`.)

---

## PART C — Google sign-in gate (browser + VM, 10 min)

8. In a browser: https://console.cloud.google.com → sign in with any Google account.
9. Top bar → select/create project `dyad-web`.
10. Left menu → **APIs & Services → OAuth consent screen** → User type **External** → fill only the required fields (app name: anything) → Save → then click **Publish App**.
11. **Credentials → Create Credentials → OAuth client ID** → type **Web application**:
    - Authorized JavaScript origins: `https://123-45-67-89.sslip.io`
    - Authorized redirect URIs: `https://123-45-67-89.sslip.io/oauth2/callback`
12. Copy the **Client ID** and **Client secret** that pop up, then on the VM:

```bash
cd /opt/dyad/app/deploy
sed -i "s|REPLACE_WITH_GOOGLE_CLIENT_ID|PASTE_CLIENT_ID|" oauth2-proxy.cfg
sed -i "s|REPLACE_WITH_GOOGLE_CLIENT_SECRET|PASTE_CLIENT_SECRET|" oauth2-proxy.cfg
```

✅ Check: `grep -c REPLACE_WITH oauth2-proxy.cfg` prints `0`.

---

## PART D — OpenViking + NextBillion context packs (Mac + VM, ~30 min mostly waiting)

13. On the VM, install OpenViking:

```bash
sudo -iu dyad bash -c 'curl -LsSf https://astral.sh/uv/install.sh | sh && ~/.local/bin/uv tool install openviking'
sudo -iu dyad mkdir -p /opt/dyad/.openviking
exit
```

14. On your **Mac**, copy the config and the context corpus up:

```bash
scp ~/.openviking/ov.conf ubuntu@123.45.67.89:/tmp/ov.conf
scp -r /Users/vishal/openviking_nb ubuntu@123.45.67.89:/tmp/openviking_nb
```

15. Back on the VM, put the config in place and register the service:

```bash
sudo -iu dyad mv /tmp/ov.conf /opt/dyad/.openviking/ov.conf
sudo -iu dyad chmod 600 /opt/dyad/.openviking/ov.conf
sed -i 's|ExecStart=/usr/local/bin/openviking-server|ExecStart=/opt/dyad/.local/bin/openviking-server|' /opt/dyad/app/deploy/openviking.service
```

---

## PART E — Langfuse (browser + VM, 5 min)

16. Browser: https://cloud.langfuse.com → sign up (free) → create **Project** `dyad-web` → **Settings → API Keys → Create** → copy `pk-lf-...` and `sk-lf-...`
17. On the VM:

```bash
cat >> /opt/dyad/app/deploy/env <<'EOF'
LANGFUSE_BASE_URL=https://cloud.langfuse.com
LANGFUSE_PUBLIC_KEY=pk-lf-PASTE
LANGFUSE_SECRET_KEY=sk-lf-PASTE
EOF
```

---

## PART F — Start everything (VM, 2 min)

```bash
systemctl daemon-reload
systemctl enable --now caddy oauth2-proxy openviking dyad-web
```

✅ Check — all four should say `active (running)`:

```bash
systemctl is-active caddy oauth2-proxy openviking dyad-web
```

---

## PART G — Load the context packs (VM, ~20 min waiting)

18. Wait for OpenViking to be healthy:

```bash
until curl -sf http://127.0.0.1:1933/health > /dev/null; do sleep 5; done; echo healthy
```

19. Ingest the 284-file NextBillion corpus (~15 min, embeddings via OpenRouter):

```bash
sudo -iu dyad bash /opt/dyad/app/scripts/openviking-ingest.sh /tmp/openviking_nb/context/nextbillion-docs viking://resources/nextbillion-docs
```

Wait for the `root: ... | contexts: N` line. 20. Ingest the policy doc:

```bash
sudo -iu dyad curl -s -X POST http://127.0.0.1:1933/api/v1/content/write \
  -H "Content-Type: application/json" \
  -d "{\"uri\": \"viking://resources/nextbillion-policy/index.md\", \"mode\": \"create\", \"wait\": true, \"content\": $(python3 -c 'import json;print(json.dumps(open("/tmp/openviking_nb/context/nextbillion-policy.md").read()))')}"
```

✅ Check:

```bash
curl -s "http://127.0.0.1:1933/api/v1/content/read?uri=viking://resources/nextbillion-policy/index.md&raw=true" | head -c 200
```

(prints the policy markdown = done)

---

## PART H — Verify and hand out the URL

21. On your Mac (browser): open `https://123-45-67-89.sslip.io`
    - First load: a Google sign-in appears → sign in with an `@nextbillion.ai` account → Dyad UI loads.
22. In Dyad: **Settings → Providers → add your OpenRouter (or other) API key** — one time, shared by everyone.
23. Create a test app → prompt it → confirm the preview shows and its iframe URL starts with `https://123-45-67-89.sslip.io/preview/`.
24. Langfuse check: make one chat → open https://cloud.langfuse.com → your trace appears in the project.
25. Share with teammates: **just the URL** `https://123-45-67-89.sslip.io`. They sign in with Google (`@nextbillion.ai` only), nothing else to set up.

Final checks (Mac terminal):

```bash
curl -sI https://123-45-67-89.sslip.io/ | head -1          # expect: HTTP/2 302
curl -s -X POST https://123-45-67-89.sslip.io/rpc/list-apps | head -c 40   # expect: 403 (auth required)
```

---

## If something breaks

| Symptom                                            | Fix                                                                                                                                                                                             |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Can't SSH                                          | Security list missing port 22 rule, or wrong IP                                                                                                                                                 |
| Browser shows certificate error                    | First visit — wait 1-2 min for Let's Encrypt; check `journalctl -u caddy -n 30`                                                                                                                 |
| Browser shows 502                                  | `systemctl is-active dyad-web` — if failed: `journalctl -u dyad-web -n 50`; most common fix: `cd /opt/dyad/app && npm rebuild better-sqlite3 dugite electron` then `systemctl restart dyad-web` |
| Google sign-in error `redirect_uri_mismatch`       | The redirect URI in Google Console must be **exactly** `https://123-45-67-89.sslip.io/oauth2/callback`                                                                                          |
| Sign-in says access denied                         | Account isn't `@nextbillion.ai` — that's the gate working                                                                                                                                       |
| Chat asks for Mapbox/Google instead of NextBillion | Context pack toggle off in the chat bar, or corpus not ingested (redo Part G)                                                                                                                   |
| Preview iframe blank                               | Send "restart the app" in the chat; if still blank check `journalctl -u dyad-web                                                                                                                | grep proxy-server-start` |
| Everything stopped after VM reboot                 | They auto-start (`systemctl enable`); if not: `systemctl start caddy oauth2-proxy openviking dyad-web`                                                                                          |

## Two things to know

- **Keys are shared**: your LLM API key and every teammate's sign-in share one settings store — anyone signed in can see it in Settings. Fine for a trusted test group; per-user isolation is phase 2.
- **One shared quota**: free agent mode has a server-wide 1000 messages/23h pool across everyone.
