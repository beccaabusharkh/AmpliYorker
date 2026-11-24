/** Deterministic demo constants for Agent Analytics richness (not live LLM billing). */

export const DEMO_MODEL = "gpt-4o-mini";
export const DEMO_PROVIDER = "openai";

/** USD per token — gpt-4o-mini-style list rates for demo dashboards only. */
export const DEMO_INPUT_USD_PER_TOKEN = 0.15 / 1_000_000;
export const DEMO_OUTPUT_USD_PER_TOKEN = 0.6 / 1_000_000;

export function estimateTokensFromChars(charLength: number): number {
  return Math.max(1, Math.ceil(charLength / 4));
}

export function syntheticTokenAndCost(
  userCharLength: number,
  answerCharLength: number,
): { inputTokens: number; outputTokens: number; totalTokens: number; costUsd: number } {
  const inputTokens = estimateTokensFromChars(userCharLength);
  const outputTokens = estimateTokensFromChars(answerCharLength);
  const totalTokens = inputTokens + outputTokens;
  const costUsd =
    Math.round((inputTokens * DEMO_INPUT_USD_PER_TOKEN + outputTokens * DEMO_OUTPUT_USD_PER_TOKEN) * 1e8) /
    1e8;
  return { inputTokens, outputTokens, totalTokens, costUsd };
}

export function syntheticQueryId(traceId: string, intent: string): string {
  return `q_${traceId.replace(/-/g, "").slice(0, 10)}_${intent}`;
}

export function syntheticInvocationId(traceId: string, toolIndex: number): string {
  return `inv-${traceId.slice(0, 8)}-${toolIndex}`;
}

/** 80–220 ms, stable for a given trace + tool index. */
export function syntheticToolLatencyMs(traceId: string, toolIndex: number): number {
  let seed = toolIndex * 131;
  for (let i = 0; i < traceId.length; i += 1) {
    seed = (seed + traceId.charCodeAt(i) * (i + 1)) % 141;
  }
  return 80 + seed;
}

export type ScriptedToolCall = {
  toolName: string;
  toolInput: string;
  toolOutput: string;
};

export function scriptedToolCallsForIntent(intent: string, traceId: string): ScriptedToolCall[] {
  const queryId = syntheticQueryId(traceId, intent);
  const baseInput = { intent, query_id: queryId };

  switch (intent) {
    case "find_article":
      return [
        {
          toolName: "search_catalog",
          toolInput: JSON.stringify({ ...baseInput, scope: "editorial", limit: 5 }),
          toolOutput: JSON.stringify({ hit_count: 3, article_ids: ["retention-myths", "daily-decisions", "cohort-traps"] }),
        },
        {
          toolName: "rank_results",
          toolInput: JSON.stringify({ ...baseInput, strategy: "recency" }),
          toolOutput: JSON.stringify({ ranked_count: 3, top_id: "retention-myths" }),
        },
      ];
    case "explore_topic":
      return [
        {
          toolName: "list_topics",
          toolInput: JSON.stringify({ ...baseInput, surface: "topic_nav" }),
          toolOutput: JSON.stringify({ topics: ["product-analytics", "experimentation", "podcast"] }),
        },
      ];
    case "subscription_help":
      return [
        {
          toolName: "lookup_billing_faq",
          toolInput: JSON.stringify({ ...baseInput, category: "premium" }),
          toolOutput: JSON.stringify({ articles_matched: 2, route: "#/subscribe" }),
        },
        {
          toolName: "get_plan_matrix",
          toolInput: JSON.stringify({ ...baseInput, currency: "USD" }),
          toolOutput: JSON.stringify({ plans: ["monthly", "annual"], starting_usd: 12 }),
        },
      ];
    case "next_read":
      return [
        {
          toolName: "recommend_reading",
          toolInput: JSON.stringify({ ...baseInput, signal: "continue_journey" }),
          toolOutput: JSON.stringify({ picks: 2, reason: "editorial_spotlight" }),
        },
      ];
    default:
      return [
        {
          toolName: "classify_intent",
          toolInput: JSON.stringify({ ...baseInput, classifier: "demo_rules_v1" }),
          toolOutput: JSON.stringify({ intent: "unknown", confidence: 0.42, fallback: true }),
        },
      ];
  }
}