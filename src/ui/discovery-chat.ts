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
      <input id="chat-input" name="q" type="text" placeholder="How do I search?" autocomplete="off" />
      <button type="submit">Ask</button>
    </form>
    <p class="discovery-chat__answer" data-chat-answer hidden></p>
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
    const entry =
      faq.find((item) => item.keywords.some((keyword) => value.includes(keyword))) ?? faq[faq.length - 1];
    if (answerEl instanceof HTMLElement) {
      answerEl.hidden = false;
      answerEl.textContent = entry.answer;
    }
  });
}
