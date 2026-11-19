import { trackDemoEvent } from "../lib/analytics/track";
import { getPageParams } from "../lib/statsig/page-params";
import faqData from "../data/faq.json";

type FaqEntry = { keywords: string[]; answer: string };

const faq = faqData as FaqEntry[];

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
    <p class="ask-daily__disclosure">${p.disclosure}</p>
    <div class="ask-daily__chips" data-chat-chips>
      ${suggestedPrompts.map((chip) => `<button type="button" data-chip="${escapeAttr(chip)}">${chip}</button>`).join("")}
    </div>
    <form class="ask-daily__form" data-chat-form>
      <label class="visually-hidden" for="chat-input">Ask a question</label>
      <input id="chat-input" data-amplitude-mask name="q" type="text" placeholder="${escapeAttr(p.input_placeholder)}" autocomplete="off" />
      <button type="submit">Ask</button>
    </form>
    <p class="ask-daily__answer" data-chat-answer data-chat-transcript hidden></p>
    <p class="ask-daily__error" data-chat-error hidden>Type a question to continue.</p>
  `;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "ask-daily-fab";
  toggle.dataset.chatToggle = "true";
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = `<span class="ask-daily-fab__icon" aria-hidden="true">?</span> ${p.panel_title}`;

  root.append(toggle, panel);

  const answerEl = panel.querySelector("[data-chat-answer]");
  const errorEl = panel.querySelector("[data-chat-error]");
  const form = panel.querySelector("[data-chat-form]");
  const input = panel.querySelector("#chat-input");
  const focusable = () =>
    Array.from(panel.querySelectorAll<HTMLElement>("input, button, [data-chip]")).filter(
      (el) => !el.hidden && el.offsetParent !== null,
    );

  const open = (): void => {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    (input as HTMLInputElement | null)?.focus();
  };

  const close = (): void => {
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
    const value = (input as HTMLInputElement).value.trim().toLowerCase();
    if (!value) {
      if (errorEl instanceof HTMLElement) {
        errorEl.hidden = false;
      }
      return;
    }
    if (errorEl instanceof HTMLElement) {
      errorEl.hidden = true;
    }
    const requestId = crypto.randomUUID();
    const conversationId = crypto.randomUUID();
    trackDemoEvent("Chat Request Submitted", {
      conversation_id: conversationId,
      request_id: requestId,
      intent: inferDiscoveryIntent(value),
      message_length: value.length,
    });
    const started = performance.now();
    const entry =
      faq.find((item) => item.keywords.some((keyword) => value.includes(keyword))) ?? faq[faq.length - 1];
    if (answerEl instanceof HTMLElement) {
      answerEl.hidden = false;
      answerEl.textContent = entry.answer;
    }
    trackDemoEvent("Chat Response Delivered", {
      conversation_id: conversationId,
      request_id: requestId,
      response_type: "support_steps",
      result_count: 1,
      response_latency_ms: performance.now() - started,
    });
  });
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