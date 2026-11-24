import { track } from "@amplitude/unified";
import { getDemoRunId, getOrCreateAnonymousId } from "./context";
import { isAmplitudeReady } from "../amplitude/init";
import { trackStatsigMirror } from "../statsig/events";

const AGENT_ENV = "development";

type AgentChatSession = {
  sessionId: string;
  turn: number;
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

export function trackAgentAiResponse(
  agentId: string,
  messageId: string,
  opts: {
    latencyMs: number;
    model?: string;
    provider?: string;
    traceId: string;
    responseText?: string;
  },
): void {
  if (!isAmplitudeReady()) {
    return;
  }
  const session = agentChatSession(agentId);
  const props = {
    ...baseAgentProps(agentId, session, opts.traceId),
    "[Agent] Message ID": messageId,
    "[Agent] Model Name": opts.model ?? "scripted-faq",
    "[Agent] Provider": opts.provider ?? "ampliyorker-demo",
    "[Agent] Latency Ms": Math.round(opts.latencyMs),
    "[Agent] Input Tokens": 0,
    "[Agent] Output Tokens": 0,
    "[Agent] Total Tokens": 0,
    "[Agent] Cost USD": 0,
    $llm_message: { text: opts.responseText ?? "" },
  };
  track("[Agent] AI Response", props, { insert_id: `agent-ar-${messageId}` });
  trackStatsigMirror("[Agent] AI Response", props);
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