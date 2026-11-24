import { track } from "@amplitude/unified";
import { getDemoRunId, getOrCreateAnonymousId } from "./context";
import { isAmplitudeReady } from "../amplitude/init";
import { trackStatsigMirror } from "../statsig/events";
import { DEMO_MODEL, DEMO_PROVIDER, syntheticTokenAndCost } from "./agent-demo-synthesis";

const AGENT_ENV = "development";

type AgentChatSession = {
  sessionId: string;
  turn: number;
  lastIntent?: string;
  lastTraceId?: string;
};

const sessions = new Map<string, AgentChatSession>();

export function agentChatSession(agentId: string): AgentChatSession {
  const existing = sessions.get(agentId);
  if (existing) {
    return existing;
  }
  const created: AgentChatSession = { sessionId: crypto.randomUUID(), turn: 0 };
  sessions.set(agentId, created);
  return created;
}

export function endAgentChatSession(agentId: string): void {
  const session = sessions.get(agentId);
  if (!session || !isAmplitudeReady()) {
    sessions.delete(agentId);
    return;
  }
  if (session.turn >= 1) {
    trackAgentSessionEnrichment(agentId, session);
  }
  const props = baseAgentProps(agentId, session, crypto.randomUUID());
  track("[Agent] Session End", props, { insert_id: `agent-end-${session.sessionId}` });
  trackStatsigMirror("[Agent] Session End", props);
  sessions.delete(agentId);
}

export function trackAgentUserMessage(
  agentId: string,
  messageId: string,
  traceId: string,
  context: Record<string, unknown>,
  opts?: { userMessageText?: string },
): void {
  if (!isAmplitudeReady()) {
    return;
  }
  const session = agentChatSession(agentId);
  session.turn += 1;
  session.lastTraceId = traceId;
  if (typeof context.intent === "string") {
    session.lastIntent = context.intent;
  }
  const llmText =
    opts?.userMessageText ??
    `[redacted user message, ${typeof context.message_length === "number" ? context.message_length : 0} chars]`;
  const props = {
    ...baseAgentProps(agentId, session, traceId),
    "[Agent] Message ID": messageId,
    "[Agent] Context": JSON.stringify({ ...context, demo_run_id: getDemoRunId() }),
    $llm_message: { text: llmText },
  };
  track("[Agent] User Message", props, { insert_id: `agent-um-${messageId}` });
  trackStatsigMirror("[Agent] User Message", props);
}

export function trackAgentToolCall(
  agentId: string,
  opts: {
    traceId: string;
    parentMessageId: string;
    invocationId: string;
    toolName: string;
    toolInput: string;
    toolOutput: string;
    latencyMs: number;
    success: boolean;
  },
): void {
  if (!isAmplitudeReady()) {
    return;
  }
  const session = agentChatSession(agentId);
  const props = {
    ...baseAgentProps(agentId, session, opts.traceId),
    "[Agent] Invocation ID": opts.invocationId,
    "[Agent] Parent Message ID": opts.parentMessageId,
    "[Agent] Tool Name": opts.toolName,
    "[Agent] Tool Input": opts.toolInput,
    "[Agent] Tool Output": opts.toolOutput,
    "[Agent] Tool Success": opts.success,
    "[Agent] Latency Ms": Math.round(opts.latencyMs),
  };
  track("[Agent] Tool Call", props, { insert_id: `agent-tc-${opts.invocationId}` });
  trackStatsigMirror("[Agent] Tool Call", props);
}

export function trackAgentAiResponse(
  agentId: string,
  messageId: string,
  opts: {
    latencyMs: number;
    model?: string;
    provider?: string;
    traceId: string;
    responseText?: string;
    userCharLength?: number;
    answerCharLength?: number;
  },
): void {
  if (!isAmplitudeReady()) {
    return;
  }
  const session = agentChatSession(agentId);
  const answerLen = opts.answerCharLength ?? opts.responseText?.length ?? 0;
  const userLen = opts.userCharLength ?? 0;
  const tokens = syntheticTokenAndCost(userLen, answerLen);
  const props = {
    ...baseAgentProps(agentId, session, opts.traceId),
    "[Agent] Message ID": messageId,
    "[Agent] Model Name": opts.model ?? DEMO_MODEL,
    "[Agent] Provider": opts.provider ?? DEMO_PROVIDER,
    "[Agent] Latency Ms": Math.round(opts.latencyMs),
    "[Agent] Input Tokens": tokens.inputTokens,
    "[Agent] Output Tokens": tokens.outputTokens,
    "[Agent] Total Tokens": tokens.totalTokens,
    "[Agent] Cost USD": tokens.costUsd,
    $llm_message: { text: opts.responseText ?? "" },
  };
  track("[Agent] AI Response", props, { insert_id: `agent-ar-${messageId}` });
  trackStatsigMirror("[Agent] AI Response", props);
}

export function trackAgentScore(
  agentId: string,
  traceId: string,
  opts: {
    targetMessageId: string;
    score: 0 | 1;
  },
): void {
  if (!isAmplitudeReady()) {
    return;
  }
  const session = agentChatSession(agentId);
  const props = {
    ...baseAgentProps(agentId, session, traceId),
    "[Agent] Score Name": "user-feedback",
    "[Agent] Score Value": opts.score,
    "[Agent] Target ID": opts.targetMessageId,
    "[Agent] Target Type": "message",
    "[Agent] Evaluation Source": "user",
  };
  track("[Agent] Score", props, { insert_id: `agent-score-${opts.targetMessageId}-${opts.score}` });
  trackStatsigMirror("[Agent] Score", props);
}

function trackAgentSessionEnrichment(agentId: string, session: AgentChatSession): void {
  const traceId = session.lastTraceId ?? crypto.randomUUID();
  const props = {
    ...baseAgentProps(agentId, session, traceId),
    demo_topic: session.lastIntent ?? "unknown",
    resolution: "answered",
    enrichment_source: "ampliyorker_demo",
  };
  track("[Agent] Session Enrichment", props, {
    insert_id: `agent-enrich-${session.sessionId}`,
  });
  trackStatsigMirror("[Agent] Session Enrichment", props);
}

function baseAgentProps(agentId: string, session: AgentChatSession, traceId: string) {
  return {
    "[Agent] Session ID": session.sessionId,
    "[Agent] Turn ID": session.turn,
    "[Agent] Trace ID": traceId,
    "[Agent] Agent ID": agentId,
    "[Agent] Env": AGENT_ENV,
    "[Agent] Runtime": "browser",
    "[Agent] Session Trigger": "interactive",
    device_id: getOrCreateAnonymousId(),
  };
}