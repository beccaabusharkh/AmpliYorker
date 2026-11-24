import { syncReaderUserProperties } from "./analytics/user-properties";
import { trackDemoEvent } from "./analytics/track";
import { isNewsletterSubscribed, subscribeToNewsletter } from "./session";

export const DAILY_BRIEFING_NEWSLETTER_ID = "daily-briefing";

export type NewsletterCopy = {
  title: string;
  subcopy: string;
  emailLabel: string;
  placeholder: string;
  submitLabel: string;
  successMessage: string;
};

export type NewsletterAttachOptions = {
  entryPoint: "home" | "article_end";
  sourceArticleId?: string;
};

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function renderNewsletterSection(
  copy: NewsletterCopy,
  options: { surfaceClass: string; inputId: string },
): HTMLElement {
  const section = document.createElement("section");
  section.className = options.surfaceClass;
  section.dataset.newsletter = "";
  section.innerHTML = `
    <h3>${copy.title}</h3>
    <p>${copy.subcopy}</p>
    <form data-newsletter-form data-precision-event>
      <label for="${escapeAttr(options.inputId)}">${copy.emailLabel}</label>
      <input id="${escapeAttr(options.inputId)}" type="email" name="email" placeholder="${escapeAttr(copy.placeholder)}" />
      <button type="submit">${copy.submitLabel}</button>
    </form>
    <p class="newsletter-success" data-newsletter-success hidden>${copy.successMessage}</p>
  `;
  return section;
}

/** Wire submit + subscribed state on a root that contains [data-newsletter-form]. */
export function attachNewsletterModule(root: ParentNode, options: NewsletterAttachOptions): void {
  const newsletterForm = root.querySelector("[data-newsletter-form]");
  const newsletterSuccess = root.querySelector("[data-newsletter-success]");
  if (isNewsletterSubscribed(DAILY_BRIEFING_NEWSLETTER_ID)) {
    if (newsletterSuccess instanceof HTMLElement) {
      newsletterSuccess.hidden = false;
    }
    if (newsletterForm instanceof HTMLElement) {
      newsletterForm.hidden = true;
    }
    return;
  }

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const newlySubscribed = subscribeToNewsletter(DAILY_BRIEFING_NEWSLETTER_ID);
    syncReaderUserProperties();
    if (newsletterSuccess instanceof HTMLElement) {
      newsletterSuccess.hidden = false;
    }
    if (newsletterForm instanceof HTMLElement) {
      newsletterForm.hidden = true;
    }
    if (newlySubscribed) {
      const props: Record<string, string> = {
        newsletter_id: DAILY_BRIEFING_NEWSLETTER_ID,
        entry_point: options.entryPoint,
      };
      if (options.sourceArticleId) {
        props.source_article_id = options.sourceArticleId;
      }
      trackDemoEvent("Newsletter Subscription Completed", props);
    }
  });
}

export function newsletterCopyFromHomeParams(p: {
  newsletter_title: string;
  newsletter_subcopy: string;
  newsletter_email_label: string;
  newsletter_placeholder: string;
  newsletter_submit_label: string;
  newsletter_success_message: string;
}): NewsletterCopy {
  return {
    title: p.newsletter_title,
    subcopy: p.newsletter_subcopy,
    emailLabel: p.newsletter_email_label,
    placeholder: p.newsletter_placeholder,
    submitLabel: p.newsletter_submit_label,
    successMessage: p.newsletter_success_message,
  };
}