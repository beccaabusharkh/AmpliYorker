import {
  endAgentChatSession,
  trackAgentAiResponse,
  trackAgentScore,
  trackAgentToolCall,
  trackAgentUserMessage,
} from "../lib/analytics/agent-chat";
import {
  scriptedToolCallsForIntent,
  syntheticInvocationId,
  syntheticToolLatencyMs,
} from "../lib/analytics/agent-demo-synthesis";
import { getPageParams } from "../lib/statsig/page-params";
import faqData from "../data/faq.json";

type FaqEntry = { keywords: string[]; answer: string };

const faq = faqData as FaqEntry[];

const ASK_DAILY_AGENT_ID = "ask-the-daily";

export function mountDiscoveryChat(root: HTMLElement): void {
  mountAskDailyAssistant(root);
}

export function mountAskDailyAssistant(root: HTMLElement): void {
  if (root.querySelector("[data-ask-daily]")) {
    return;
  }

  const p = getPageParams("discovery_chat");
  const suggestedPrompts = [...p.suggested_prompts];

  const panel = document.createElement("aside");
  panel.className = "ask-daily-panel";
  panel.dataset.askDaily = "true";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "ask-daily-title");
  panel.innerHTML = `
    <header class="ask-daily__header">
      <div>
        <strong id="ask-daily-title">${p.panel_title}</strong>
        <p class="ask-daily__subtitle">${p.panel_subtitle}</p>
      </div>
      <button type="button" class="ask-daily__close" data-chat-close aria-label="Close Ask the Daily">×</button>
    </header>
    <div
      class="ask-daily__transcript"
      data-chat-answer
      data-chat-transcript
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Conversation with Ask the Daily"
    ></div>
    <div class="ask-daily__chips" data-chat-chips>
      ${suggestedPrompts.map((chip) => `<button type="button" data-chip="${escapeAttr(chip)}">${chip}</button>`).join("")}
    </div>
    <form class="ask-daily__form" data-chat-form data-precision-event>
      <label class="visually-hidden" for="chat-input">Ask a question</label>
      <input id="chat-input" data-amplitude-mask name="q" type="text" placeholder="${escapeAttr(p.input_placeholder)}" autocomplete="off" />
      <button type="submit">Ask</button>
    </form>
    <p class="ask-daily__error" data-chat-error hidden>Type a question to continue.</p>
  `;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "ask-daily-fab";
  toggle.dataset.chatToggle = "true";
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = `<span class="ask-daily-fab__icon" aria-hidden="true">?</span> ${p.panel_title}`;

  root.append(toggle, panel);

  const transcriptEl = panel.querySelector("[data-chat-transcript]");
  const errorEl = panel.querySelector("[data-chat-error]");
  const form = panel.querySelector("[data-chat-form]");
  const input = panel.querySelector("#chat-input");
  let sessionTurns = 0;

  const focusable = () =>
    Array.from(panel.querySelectorAll<HTMLElement>("input, button, [data-chip]")).filter(
      (el) => !el.hidden && el.offsetParent !== null,
    );

  const scrollTranscript = (): void => {
    if (transcriptEl instanceof HTMLElement) {
      transcriptEl.scrollTop = transcriptEl.scrollHeight;
    }
  };

  const appendUserBubble = (text: string): void => {
    if (!(transcriptEl instanceof HTMLElement)) {
      return;
    }
    const bubble = document.createElement("div");
    bubble.className = "ask-daily__msg ask-daily__msg--user";
    bubble.textContent = text;
    transcriptEl.append(bubble);
    scrollTranscript();
  };

  const appendAgentBubble = (text: string, messageId: string, traceId: string): void => {
    if (!(transcriptEl instanceof HTMLElement)) {
      return;
    }
    const turn = document.createElement("div");
    turn.className = "ask-daily__agent-turn";

    const bubble = document.createElement("div");
    bubble.className = "ask-daily__msg ask-daily__msg--agent";
    bubble.textContent = text;

    const feedback = document.createElement("div");
    feedback.className = "ask-daily__feedback";
    feedback.setAttribute("role", "group");
    feedback.setAttribute("aria-label", "Rate this answer");
    feedback.innerHTML = `
      <button type="button" class="ask-daily__score" data-score="1" aria-label="Helpful">👍</button>
      <button type="button" class="ask-daily__score" data-score="0" aria-label="Not helpful">👎</button>
    `;

    feedback.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-score]");
      if (!target || feedback.dataset.scored === "true") {
        return;
      }
      const score = target.dataset.score === "1" ? 1 : 0;
      feedback.dataset.scored = "true";
      trackAgentScore(ASK_DAILY_AGENT_ID, traceId, {
        targetMessageId: messageId,
        score,
      });
      feedback.querySelectorAll("button").forEach((btn) => {
        btn.disabled = true;
        btn.classList.toggle("ask-daily__score--chosen", btn === target);
      });
    });

    turn.append(bubble, feedback);
    transcriptEl.append(turn);
    scrollTranscript();
  };

  const open = (): void => {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    (input as HTMLInputElement | null)?.focus();
  };

  const close = (): void => {
    if (sessionTurns > 0) {
      endAgentChatSession(ASK_DAILY_AGENT_ID);
      sessionTurns = 0;
    }
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  };

  toggle.addEventListener("click", () => (panel.hidden ? open() : close()));
  panel.querySelector("[data-chat-close]")?.addEventListener("click", close);

  window.addEventListener("keydown", (event) => {
    if (event.altKey && event.key.toLowerCase() === "d") {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
        return;
      }
      event.preventDefault();
      panel.hidden ? open() : close();
    }
    if (event.key === "Escape" && !panel.hidden) {
      close();
    }
  });

  panel.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || panel.hidden) {
      return;
    }
    const items = focusable();
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) {
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  panel.querySelectorAll("[data-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.getAttribute("data-chip") ?? "";
      if (input instanceof HTMLInputElement) {
        input.value = value;
        input.focus();
      }
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const rawValue = (input as HTMLInputElement).value.trim();
    const value = rawValue.toLowerCase();
    if (!value) {
      if (errorEl instanceof HTMLElement) {
        errorEl.hidden = false;
      }
      return;
    }
    if (errorEl instanceof HTMLElement) {
      errorEl.hidden = true;
    }

    const traceId = crypto.randomUUID();
    const userMessageId = crypto.randomUUID();
    const responseMessageId = crypto.randomUUID();
    const intent = inferDiscoveryIntent(value);

    trackAgentUserMessage(ASK_DAILY_AGENT_ID, userMessageId, traceId, {
      surface: "ask_the_daily",
      intent,
      message_length: value.length,
    }, { userMessageText: userMessageSurrogate(intent, value.length) });

    const tools = scriptedToolCallsForIntent(intent, traceId);
    tools.forEach((tool, index) => {
      trackAgentToolCall(ASK_DAILY_AGENT_ID, {
        traceId,
        parentMessageId: userMessageId,
        invocationId: syntheticInvocationId(traceId, index),
        toolName: tool.toolName,
        toolInput: tool.toolInput,
        toolOutput: tool.toolOutput,
        latencyMs: syntheticToolLatencyMs(traceId, index),
        success: true,
      });
    });

    appendUserBubble(rawValue);
    (input as HTMLInputElement).value = "";
    sessionTurns += 1;

    const started = performance.now();
    const entry =
      faq.find((item) => item.keywords.some((keyword) => value.includes(keyword))) ?? faq[faq.length - 1];
    appendAgentBubble(entry.answer, responseMessageId, traceId);

    const latencyMs = performance.now() - started;
    trackAgentAiResponse(ASK_DAILY_AGENT_ID, responseMessageId, {
      latencyMs,
      traceId,
      responseText: entry.answer,
      userCharLength: value.length,
      answerCharLength: entry.answer.length,
    });
  });
}

function userMessageSurrogate(intent: string, length: number): string {
  if (intent !== "unknown") {
    return intent;
  }
  return `[redacted user message, ${length} chars]`;
}

function inferDiscoveryIntent(value: string): string {
  if (value.includes("search")) {
    return "find_article";
  }
  if (value.includes("topic")) {
    return "explore_topic";
  }
  if (value.includes("premium") || value.includes("subscribe")) {
    return "subscription_help";
  }
  if (value.includes("read") || value.includes("next")) {
    return "next_read";
  }
  return "unknown";
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}