import { trackDemoEvent } from "../lib/analytics/track";
import faqData from "../data/faq.json";

type FaqEntry = { keywords: string[]; answer: string };

const faq = faqData as FaqEntry[];

export function mountDiscoveryChat(root: HTMLElement): void {
  if (root.querySelector("[data-discovery-chat]")) {
    return;
  }

  const panel = document.createElement("aside");
  panel.className = "discovery-chat";
  panel.dataset.discoveryChat = "true";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Simulated assistant");
  panel.innerHTML = `
    <header class="discovery-chat__header">
      <strong>Simulated assistant</strong>
      <button type="button" class="discovery-chat__close" data-chat-close aria-label="Close chat">×</button>
    </header>
    <p class="discovery-chat__hint">Ask about search, topics, newsletter signup, or sponsored content.</p>
    <form class="discovery-chat__form" data-chat-form>
      <label class="visually-hidden" for="chat-input">Question</label>
      <input id="chat-input" data-amplitude-mask name="q" type="text" placeholder="How do I search?" autocomplete="off" />
      <button type="submit">Ask</button>
    </form>
    <p class="discovery-chat__answer" data-chat-answer data-chat-transcript hidden></p>
  `;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "discovery-chat__toggle";
  toggle.dataset.chatToggle = "true";
  toggle.textContent = "Discovery chat";

  root.append(toggle, panel);

  const answerEl = panel.querySelector("[data-chat-answer]");
  const form = panel.querySelector("[data-chat-form]");
  const input = panel.querySelector("#chat-input");

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

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = (input as HTMLInputElement).value.trim().toLowerCase();
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
  if (value.includes("read") || value.includes("next")) {
    return "next_read";
  }
  return "unknown";
}
