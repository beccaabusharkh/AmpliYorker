# Agent Analytics — Ask the Daily (AMP-45)

## Diagnosis

**Symptom:** Sessions appear in Amplitude Agent Analytics, but the thread view shows **"No messages"**.

**Root cause (two bugs):**

1. **Missing `$llm_message` payload** — `[Agent] User Message` and `[Agent] AI Response` were emitted with session/turn/trace metadata only. Amplitude Agent Analytics requires `$llm_message` as an **object** `{ text: "..." }`. A plain string property or omitting the field does not populate the conversation transcript UI.

2. **Mismatched trace IDs per turn** — `trackAgentUserMessage` generated a new `[Agent] Trace ID` internally while `discovery-chat.ts` passed a different `traceId` into `trackAgentAiResponse`. User and assistant events for the same turn could not be joined in Agent Analytics.

**Privacy baseline:** Product events still avoid raw free-text. For Agent Analytics UI, Ask the Daily now sends truncated user display text in `$llm_message` (max 500 chars). Session Replay masks `#chat-input` and chat surfaces in the player via existing privacy selectors.

## Fix

| Area | Change |
| --- | --- |
| `src/lib/analytics/agent-chat.ts` | Add `$llm_message: { text }` on User Message and AI Response; accept `traceId` on User Message (caller-owned, shared per turn); optional `userMessageText` / `responseText`. |
| `src/ui/discovery-chat.ts` | One `traceId` per submit; `telemetryUserMessageText(rawValue)` on User Message (session title + thread); FAQ text on AI Response; `endAgentChatSession("ask-the-daily")` on panel close after ≥1 turn; removed duplicate product chat events. |
| `src/lib/analytics/agent-chat.ts` (replay) | Spread `sessionReplay().getSessionReplayProperties()` and optional `$session_id` on every `[Agent]` event so **View Replay** works in Agent Analytics. |
| UI | In-panel chat transcript (user right/gray, agent left); disclosure paragraph removed; multi-turn session history. |
| `account-support-chat.ts` | API alignment only (shared trace + `$llm_message`; product chat events unchanged). |

## Verification (2026-11-24)

- `npm run typecheck` — **PASS**
- `npm run build` — **PASS**
- `npm run test:statsig-params` — **PASS** (14 pages)
- `npm run test:custom-events-parity` — **PASS** (added `[Agent] User Message` / `[Agent] AI Response` dict entries)

## Live validation (manual)

1. Open Ask the Daily, submit a chip or typed question.
2. In Amplitude Agent Analytics, confirm the session list title is the first user message and the thread shows user + assistant rows (user row shows typed text; assistant shows FAQ snippet).
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

## Session Replay in Agent Analytics

**Symptom:** No **View Replay** on an agent session even though Session Replay is sampled on the demo site.

**Cause:** The session replay enrichment plugin auto-attaches `[Amplitude] Session Replay ID` to normal `track()` events. `[Agent]` events are emitted through the same `track()` API but need replay properties merged on each payload so Agent Analytics can join the session to a replay segment.

**Fix:** `agentSessionReplayProperties()` in `agent-chat.ts` calls `sessionReplay()?.getSessionReplayProperties()` when Amplitude is ready and spreads the result into `baseAgentProps()` for User Message, Tool Call, AI Response, Score, Session Enrichment, and Session End.

**How to validate View Replay**

1. Use a browser session that is in the replay sample (`VITE_AMPLITUDE_REPLAY_SAMPLE_RATE`, default 0.25).
2. Open Ask the Daily, submit at least one message, then close the panel (Session End).
3. In Amplitude **Agent Analytics**, open the session and confirm agent events include `[Amplitude] Session Replay ID` on the event details (same value across the turn).
4. When the replay ID is present and replay data has landed, **View Replay** appears on the session; opening it should show masked chat input per `#chat-input` mask selectors while transcript text comes from `$llm_message`.