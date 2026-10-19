Vendor Context Layer ("context packs") for Dyad

Context

The user built a NextBillion.ai "context layer" in bolt.diy (documented in context/context-layer.md): a toggle that injects a distilled knowledge block into the system prompt so the agent starts a location-app task already knowing NextBillion's APIs, instead of burning tokens researching competing tools. They want the same in Dyad, extensible to any vendor, with the toggle next to the "App selected" selector — a customized Dyad with a per-vendor context toggle.

User's spec for the injected content: "just enough to fetch the exact API information with the endpoint, fields, data types for the right context, shouldn't need external information but shouldn't need fluff," plus (follow-up) request and response body examples where available and relevant, so the agent can implement against an API in one shot. → The injected block is a distilled API reference cheat-sheet (endpoint, method, request fields + types, sample request body, sample response body), NOT a prose overview, and NOT the full corpus. No on-demand doc tool needed.

Corpus source: context/nextbillion-docs-full/ — 282 md files, ~5MB (~1.2M tokens) of REST API references, TS SDK type references, and tutorials. This is the source material for a one-time distillation; it is not shipped in the app.

Context layer vs MCP — answer: complementary, not competing. Dyad already ships MCP support and NextBillion.ai publishes an official MCP server (nextbillion-ai/nextbillion-mcp, 15+ live API tools via npx nextbillion-mcp). But MCP gives the agent live API calls, not planning knowledge — it doesn't stop the agent from wandering into Mapbox/Google research. The context pack is the right primary build; MCP wiring is a possible follow-up (Dyad's existing MCP support already covers it).

Key repo facts (verified):

- constructSystemPrompt (src/prompts/system_prompt.ts:748) is the assembly entry; domain blocks (Supabase, Neon, security rules) are appended post-assembly via systemPrompt += in src/ipc/handlers/chat_stream_handlers.ts (three call sites: ~2328 main, ~2774 read-only, ~2836 plan-mode).
- Agent mode reuses the assembled systemPrompt (local_agent_handler.ts:1451), so one injection point covers Build + Pro Agent modes.
- Markdown-as-prompt pattern exists: src/prompts/guides/\*.md imported with Vite ?raw.
- Chat submit: useStreamChat().streamMessage → ChatStreamParamsSchema (src/ipc/types/chat.ts:174) on chat:stream; queue mirror in src/chat_stream/transport.ts (~93, .strict()), persistence in src/chat_stream/persistence.ts.
- Jotai persisted-atom pattern exists (chatTabSessionStorageAtom).

Design

Data-driven "context packs" — a registry, not per-vendor code:

1.  src/prompts/context_packs/<vendor>/index.md — distilled API-reference block, authored once from the corpus (Step 0), imported with ?raw like the existing guides.
2.  Global toggle (jotai atomWithStorage, not per-chat) → contextPacks field on the wire → systemPrompt += the index block next to the Supabase/Neon blocks.
3.  Adding a vendor = add folder with an index.md + one registry line. No code per vendor.

Steps

Step 0 — Author content (one-time, no runtime code)

- src/prompts/context_packs/nextbillion/index.md: LLM-assisted distillation of context/nextbillion-docs-full/, hand-edited. Structure:
  - One short framing paragraph (what NextBillion.ai is; when to reach for it vs generic map libs) — no fluff beyond this.
  - Per API (directions, distance-matrix, geocode fwd/rev/batch, autocomplete/autosuggest, place search, isochrone, route-optimization, live-tracking, geofence, static-map, SDK entry points): base endpoint URL, method, auth shape (key={your_api_key} query param), key request fields with formats/types, a compact example request body and example response body (trimmed of repetitive fields, enough to implement against without guessing shapes). Examples omitted for trivial APIs (e.g. static map) where the field table says it all. Param tables condensed to fields that matter in practice; exhaustive per-param detail trimmed (ponytail ceiling: rare params omitted; corpus stays in the repo if ever needed).
  - A short "which API when" routing guide (the core of the use case: agent shouldn't research competitors, it should pick the right NextBillion API).
  - Sample/demo key behavior if the corpus documents one.
  - Target ~10–18k tokens (slightly larger to carry request/response examples), self-sufficient: no external info needed to implement against the APIs.

Step 1 — Registry + content loader

- src/prompts/context_packs/registry.ts (shared, zero imports, safe for renderer + schema use):
  export const CONTEXT_PACK_IDS = ["nextbillion"] as const;
  export const CONTEXT_PACKS: Record<(typeof CONTEXT_PACK_IDS)[number], { name: string }> = { nextbillion: { name: "NextBillion.ai" } };
- src/prompts/context_packs/content.ts (main-only, never imported by renderer code):
  - ?raw import of index.md (add to src/raw-imports.d.ts pattern used by guides).
  - getContextPackPromptBlock(packs?: string[]): string — empty string when off/empty; else \n\n<context-pack vendor="NextBillion.ai">\n…index…\n</context-pack>; unknown ids ignored.

Step 2 — Wire field

- src/ipc/types/chat.ts: add contextPacks: z.array(z.enum(CONTEXT_PACK_IDS)).max(2).optional() to ChatStreamParamsSchema.
- src/chat_stream/transport.ts: add the shape to ChatQueueEntrySchema only (it's .strict()).
- src/chat_stream/persistence.ts: persist/read alongside requestedChatMode; do not add to EDIT_QUEUE_ENTRY — edits preserve stored packs.
- src/chat_stream/renderer_facade.ts StreamRequest: add contextPacks?: string[].
- src/hooks/useStreamChat.ts: read contextPacksAtom via useAtomValue, include in every StreamRequest it builds. One change covers all ChatInput submit sites, home page, and the first-prompt path.
- src/atoms/chatAtoms.ts: export const contextPacksAtom = atomWithStorage<string[]>("dyad-context-packs", []).

Step 3 — Injection

- src/ipc/handlers/chat_stream_handlers.ts: after each of the three constructSystemPrompt calls, systemPrompt += getContextPackPromptBlock(req.contextPacks); (placed before the Supabase/Neon blocks so vendor context sits with other domain blocks). Skip token_count_handlers.ts — token estimate runs slightly low when on (v1 ceiling).

Step 4 — UI

- src/components/ContextPackSelector.tsx: chip (book icon; shows pack name when on) opening a Popover listing CONTEXT_PACKS with a checkbox per pack bound to contextPacksAtom (useAtom). Style matches the app-selector chip in HomeChatInput.tsx (px-2 py-1 text-xs rounded-lg bg-primary/10).
- Mount in src/components/chat/HomeChatInput.tsx in the flex div next to the app selector chip (~line 296), and in src/components/ChatInputControls.tsx (in-app chat bar).
- Plain English strings (neighboring chips use raw strings too); no i18n keys, no Settings page entry for v1.

Tests

- src/prompts/context_packs/registry.test.ts: empty/undefined packs → ""; ["nextbillion"] → contains <context-pack wrapper and index content; unknown id ignored.
- npm run ts + npm run lint + npm run fmt.
- Manual verification: toggle on at home → new chat "build me a location-based app" → agent uses NextBillion endpoints/fields directly without competitor research; toggle off → no <context-pack in prompt; queued message retains packs after app reload.

Explicitly skipped (add when needed)

Full corpus bundling + read_vendor_doc agent tool (add if the distilled block proves insufficient in practice), per-chat pack state, keyword auto-selection, Settings page entry, i18n keys, MCP wiring, RAG/embeddings/runtime retrieval, resources-at-build-time loading.
