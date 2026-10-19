# NextBillion Context Layer for Bolt.diy

This document describes the changes made to the upstream Bolt.diy project from stackblitz-labs/bolt.diy so that it can support a small, focused NextBillion.ai context layer. The goal is to demonstrate that the model can be given extra domain-specific knowledge through the hidden system prompt without redesigning the whole app runtime.

## 1. Goal

The project adds a lightweight evidence layer that injects NextBillion.ai context into the chat system prompt when a toggle is enabled. The goal is not to replace the main Bolt.diy architecture or add a full RAG system. It is a proof-of-concept for domain-aware prompting.

Scope:

- inject NextBillion company and API context into prompt generation
- allow runtime toggle on/off for comparison
- validate the prompt includes repo-defined context when enabled
- keep the rest of Bolt.diy behavior unchanged

## 2. Base architecture in upstream Bolt.diy

The upstream project follows the standard pattern for Bolt.diy:

- user chat request lands in the frontend chat UI
- request is sent to the backend route in app/routes/api.chat.ts
- server-side streaming path builds the prompt in app/lib/.server/llm/stream-text.ts
- prompt library composes the system prompt in app/lib/common/prompt-library.ts
- default prompt templates live under app/lib/common/prompts/\*
- code/project context is also injected separately based on project state and optimization flags

This means that the cleanest customization point is the prompt-building pipeline rather than the WebContainer runtime itself.

## 3. What was added

### 3.1 Knowledge module

New files:

- app/lib/nextbillion/knowledge.ts
- app/lib/nextbillion/context.ts

These files define the canonical NextBillion.ai knowledge block used by the prompt system.

The knowledge includes:

- company/product framing
- relevant APIs and categories
- map SDK metadata
- key concepts
- sample locations
- repo-only validation facts used for controlled A/B testing

The context function uses a deterministic selector pattern:

- it inspects the user request text
- it matches relevant route/geocoding/maps/fleet concepts
- it returns a compact knowledge block for the system prompt

### 3.2 Prompt injection hook

Files updated:

- app/lib/common/prompt-library.ts
- app/lib/common/prompts/new-prompt.ts
- app/lib/common/prompts/prompts.ts

The prompt library was extended to accept a runtime flag:

- nextBillionContextEnabled?: boolean

This flag is forwarded to the prompt-generation functions so that the hidden system prompt includes the NextBillion block only when enabled.

### 3.3 Runtime toggle flow

Files updated:

- app/components/chat/Chat.client.tsx
- app/components/chat/ChatBox.tsx
- app/components/@settings/tabs/settings/SettingsTab.tsx
- app/routes/api.chat.ts

The runtime toggle is persisted in the user profile and sent alongside the normal chat request. This allows:

- toggle ON => prompt includes NextBillion context
- toggle OFF => prompt omits the block

### 3.4 Validation and proof

Files added:

- app/lib/common/prompt-library.test.ts

The tests make sure that repo-only sentinel values appear only when the toggle is enabled, proving the knowledge comes from the repo prompt layer rather than general model memory.

### 3.5 Debug and env loading support

Files added or updated:

- app/routes/api.debug.env.ts
- vite.config.ts
- pre-start.cjs

These support validation of environment variables and ensure the local env file can be picked up in the dev process without leaking the actual key into source control.

## 4. Data flow

The final runtime flow is:

1. User opens the chat UI.
2. Profile stored in localStorage contains nextBillionContextEnabled.
3. Chat client reads the profile and sends the flag in the request body.
4. app/routes/api.chat.ts receives the flag.
5. streamText includes the flag in StreamingOptions.
6. PromptLibrary chooses the prompt and passes the flag into system prompt generation.
7. getNextBillionContext decides whether to append the NextBillion context block.
8. The resulting hidden system prompt is sent to the LLM.

This gives an explicit ON/OFF switch for domain context without changing the rest of the Bolt.diy architecture.

## 5. File-by-file change summary

### app/components/chat/Chat.client.tsx

- reads the saved NextBillion profile flag
- includes it in the `/api/chat` request body

### app/components/chat/ChatBox.tsx

- provides the UI toggle behavior
- updates localStorage when the user changes the state

### app/components/@settings/tabs/settings/SettingsTab.tsx

- stores the setting as part of the persisted user profile
- exposes the runtime toggle in the settings UI

### app/routes/api.chat.ts

- reads request JSON
- forwards nextBillionContextEnabled to StreamingOptions

### app/lib/.server/llm/stream-text.ts

- extracts the user request
- passes the toggle into the prompt library
- ensures the final system prompt is built with the correct flag

### app/lib/common/prompt-library.ts

- extends PromptOptions with nextBillionContextEnabled
- forwards the flag into both default and original prompt builders

### app/lib/common/prompts/new-prompt.ts

- injects the NextBillion context block into the tuned default prompt when enabled

### app/lib/common/prompts/prompts.ts

- original prompt path also handles the flag

### app/lib/nextbillion/knowledge.ts

- defines the static NextBillion facts, API metadata, SDK metadata, and repo-only validation markers

### app/lib/nextbillion/context.ts

- builds company context and API context from the knowledge model
- returns empty strings when disabled
- includes repo-only sentinel validation facts for A/B testing

### app/lib/common/prompt-library.test.ts

- verifies the repo-only facts appear only when enabled

### vite.config.ts and pre-start.cjs

- load local env values from the correct location for the dev server

### app/routes/api.debug.env.ts

- exposes env debug info for validation

## 6. Validation strategy

This implementation intentionally uses a strong evidence-based validation method:

- same prompt for ON/OFF
- same model/provider settings
- toggle is the only variable
- repo-only sentinel facts are added to the hidden context
- if ON includes them and OFF does not, the effect is real and traceable to the repo context layer

This avoids the common false-positive of relying on general world knowledge, which the model already knows from training data.

## 7. Important constraints

This implementation is intentionally not a full RAG system:

- no embeddings
- no vector database
- no internet fetch at runtime
- no redesign of the WebContainer or project runtime

The current context layer is a compact prompt augmentation layer built from a deterministic repo-defined knowledge block.

This is a precise, controllable PoC that can be expanded later into live fetch or RAG, but it is intentionally narrow and easy to reason about.

## 8. Security note

The actual API key used during local runtime is intentionally not stored in the repository. The app env file is ignored by git. The repository contains only code and prompt logic, not secret credentials.

## 9. Practical takeaway

The project now demonstrates the following:

- a Bolt.diy runtime can carry domain-specific context via a hidden system prompt
- the context can be toggled at runtime
- the effect can be validated with repo-local sentinel values
- the pattern is reusable for other domain adapters beyond NextBillion

This gives a clean template for future context-layer integrations using the upstream Bolt.diy base project as the starting point.
