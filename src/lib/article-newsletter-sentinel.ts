import { getStatsigClient } from "./statsig/init";
import { recordExposure } from "./statsig/exposures";
import { isNewsletterSubscribed } from "./session";
import {
  attachNewsletterModule,
  DAILY_BRIEFING_NEWSLETTER_ID,
  renderNewsletterSection,
  type NewsletterCopy,
} from "./newsletter-ui";

const ARTICLE_LAYER = "article_layer";
const SHOW_PARAM = "show_article_newsletter";

let activeTeardown: (() => void) | null = null;
/** Prevents duplicate layer reads for the same mounted article page. */
let layerReadForMount: string | null = null;

export function resetArticleNewsletterSentinel(): void {
  activeTeardown?.();
  activeTeardown = null;
  layerReadForMount = null;
}

export function attachArticleNewsletterSentinel(
  root: HTMLElement,
  articleId: string,
  copy: NewsletterCopy,
): void {
  resetArticleNewsletterSentinel();

  const sentinel = root.querySelector("[data-article-newsletter-sentinel]");
  const mount = root.querySelector("[data-article-newsletter-mount]");
  if (!(sentinel instanceof HTMLElement) || !(mount instanceof HTMLElement)) {
    return;
  }

  mount.hidden = true;
  mount.replaceChildren();

  const mountId = `article-newsletter-email-${articleId.replace(/[^a-z0-9-]/gi, "-")}`;

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }
      observer.disconnect();

      if (layerReadForMount === articleId) {
        return;
      }
      layerReadForMount = articleId;

      const client = getStatsigClient();
      const showNewsletter =
        client?.getLayer(ARTICLE_LAYER).get(SHOW_PARAM, false) === true;

      recordExposure(
        ARTICLE_LAYER,
        showNewsletter ? "treatment" : "control",
        "article-newsletter-sentinel",
        false,
        SHOW_PARAM,
      );

      if (!showNewsletter || isNewsletterSubscribed(DAILY_BRIEFING_NEWSLETTER_ID)) {
        return;
      }

      const block = renderNewsletterSection(copy, {
        surfaceClass: "article-end-newsletter home-fidelity-band",
        inputId: mountId,
      });
      mount.hidden = false;
      mount.append(block);
      attachNewsletterModule(mount, {
        entryPoint: "article_end",
        sourceArticleId: articleId,
      });
    },
    { threshold: 0, rootMargin: "0px 0px -10% 0px" },
  );

  observer.observe(sentinel);
  activeTeardown = () => {
    observer.disconnect();
    mount.hidden = true;
    mount.replaceChildren();
  };
}