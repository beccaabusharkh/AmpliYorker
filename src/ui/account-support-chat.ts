import { trackDemoEvent } from "../lib/analytics/track";
import accountFaqData from "../data/account-faq.json";

type FaqEntry = { keywords: string[]; answer: string };

const faq = accountFaqData as FaqEntry[];

export function mountAccountSupportChat(root: HTMLElement): void {
  if (root.querySelector("[data-account-chat]")) {
    return;
  }

  const panel = document.createElement("aside");
  panel.className = "account-support-chat";
  panel.dataset.accountChat = "true";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Simulated account support");
  panel.innerHTML = `
    <header class="account-support-chat__header">
      <strong>Simulated account support</strong>
      <button type="button" class="account-support-chat__close" data-account-chat-close aria-label="Close">×</button>
    </header>
    <p class="account-support-chat__hint">Billing, paywall, cancellation, and device-switch help (FAQ from repo JSON).</p>
    <form class="account-support-chat__form" data-account-chat-form>
      <label class="visually-hidden" for="account-chat-input">Question</label>
      <input id="account-chat-input" data-amplitude-mask name="q" type="text" placeholder="How do I cancel?" autocomplete="off" />
      <button type="submit">Ask</button>
    </form>
    <p class="account-support-chat__answer" data-account-chat-answer data-chat-transcript hidden></p>
  `;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "account-support-chat__toggle";
  toggle.dataset.accountChatToggle = "true";
  toggle.textContent = "Account support";

  root.append(toggle, panel);

  const answerEl = panel.querySelector("[data-account-chat-answer]");
  const input = panel.querySelector("#account-chat-input");

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
  panel.querySelector("[data-account-chat-close]")?.addEventListener("click", close);

  panel.querySelector("[data-account-chat-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = (input as HTMLInputElement).value.trim().toLowerCase();
    const requestId = crypto.randomUUID();
    const conversationId = crypto.randomUUID();
    trackDemoEvent("Chat Request Submitted", {
      conversation_id: conversationId,
      request_id: requestId,
      intent: value.includes("cancel") || value.includes("bill") ? "account_support" : "subscription_support",
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
