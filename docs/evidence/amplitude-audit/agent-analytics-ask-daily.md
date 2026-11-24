# Agent Analytics — Ask the Daily (AMP-45)

## Diagnosis

**Symptom:** Sessions appear in Amplitude Agent Analytics, but the thread view shows **"No messages"**.

**Root cause (two bugs):**

1. **Missing `$llm_message` payload** — `[Agent] User Message` and `[Agent] AI Response` were emitted with session/turn/trace metadata only. Amplitude Agent Analytics requires `$llm_message` as an **object** `{ text: "..." }`. A plain string property or omitting the field does not populate the conversation transcript UI.

2. **Mismatched trace IDs per turn** — `trackAgentUserMessage` generated a new `[Agent] Trace ID` internally while `discovery-chat.ts` passed a different `traceId` into `trackAgentAiResponse`. User and assistant events for the same turn could not be joined in Agent Analytics.

**Privacy baseline:** `custom-events.yml` forbids raw free-text chat in telemetry. User messages must use a surrogate; scripted FAQ answers are safe for AI Response.

## Fix

| Area | Change |
| --- | --- |
| `src/lib/analytics/agent-chat.ts` | Add `$llm_message: { text }` on User Message and AI Response; accept `traceId` on User Message (caller-owned, shared per turn); optional `userMessageText` / `responseText`. |
| `src/ui/discovery-chat.ts` | One `traceId` per submit; surrogate text from intent or `[redacted user message, N chars]`; FAQ text on AI Response; `endAgentChatSession("ask-the-daily")` on panel close after ≥1 turn; removed duplicate product chat events. |
| UI | In-panel chat transcript (user right/gray, agent left); disclosure paragraph removed; multi-turn session history. |
| `account-support-chat.ts` | API alignment only (shared trace + `$llm_message`; product chat events unchanged). |

## Verification (2026-11-24)

- `npm run typecheck` — **PASS**
- `npm run build` — **PASS**
- `npm run test:statsig-params` — **PASS** (14 pages)
- `npm run test:custom-events-parity` — **PASS** (added `[Agent] User Message` / `[Agent] AI Response` dict entries)

## Live validation (manual)

1. Open Ask the Daily, submit a chip or typed question.
2. In Amplitude Agent Analytics, confirm the session shows user + assistant rows with message text (user row shows intent surrogate; assistant shows FAQ snippet).
3. Confirm both events share the same `[Agent] Trace ID` and `[Agent] Turn ID` for that exchange.
4. Close panel after a turn; confirm `[Agent] Session End` fires once.

## Synthetic demo richness (AMP-45 extension)

Customer demos need plausible Agent Analytics depth without a live LLM. All synthesis lives in `src/lib/analytics/agent-demo-synthesis.ts`.

| Signal | Scheme |
| --- | --- |
| **Tokens & cost** | `ceil(chars / 4)` for input (user message length) and output (FAQ answer). Model `gpt-4o-mini`, provider `openai`. Cost uses fixed rates: **$0.15 / 1M input tokens**, **$0.60 / 1M output tokens** (`DEMO_INPUT_USD_PER_TOKEN`, `DEMO_OUTPUT_USD_PER_TOKEN`). Same lengths → same token/cost values. Wall-clock **latency stays real** (`performance.now()`). |
| **Tool calls** | 1–2 `[Agent] Tool Call` events per Ask the Daily turn, between User Message and AI Response. Same session/turn/trace/agent IDs. Intent → scripted tools (`search_catalog`, `lookup_billing_faq`, etc.) with JSON `[Agent] Tool Input` / `[Agent] Tool Output` using `intent` + synthetic `query_id` only (no raw user text). Latency **80–220 ms** from `syntheticToolLatencyMs(traceId, index)`. |
| **Scores** | Thumbs up/down under each agent bubble; one `[Agent] Score` per message (`user-feedback`, 0/1). |
| **Session enrichment** | Before `[Agent] Session End`, emit `[Agent] Session Enrichment` with `demo_topic` = last intent, `resolution: answered`. |

### Verification (extension, 2026-11-24)

- `npm run typecheck` — **PASS**
- `npm run build` — **PASS**
- `npm run test:statsig-params` — **PASS**
- `npm run test:custom-events-parity` — **PASS** (dict 43, wired 36)