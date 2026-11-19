import { getArticleById } from "./articles";
import { STATSIG_EXPERIMENTS } from "./statsig/catalog";
import { getSubscriptionMessageVariant } from "./statsig/evaluate";
import { getPageParams } from "./statsig/page-params";
import { hasActiveSubscription, isLoggedIn, loadSession } from "./session";

export function isPremiumArticle(articleId: string): boolean {
  const article = getArticleById(articleId);
  return Boolean(article?.premium);
}

export function canAccessArticle(articleId: string): boolean {
  if (!isPremiumArticle(articleId)) {
    return true;
  }
  return hasActiveSubscription();
}

export function paywallMessage(surface = "paywall"): string {
  const p = getPageParams("article");
  const session = loadSession();
  if (!isLoggedIn()) {
    return p.paywall_message_logged_out;
  }
  if (!hasActiveSubscription()) {
    const variant = getSubscriptionMessageVariant(surface);
    return variant === "urgency"
      ? p.paywall_message_subscribe_urgency
      : p.paywall_message_subscribe_control;
  }
  if (session.subscription.status === "canceled") {
    return p.paywall_message_canceled;
  }
  if (session.subscription.status === "expired") {
    return p.paywall_message_expired;
  }
  return p.paywall_message_subscribe_control;
}

export function paywallMessageExperimentId(): string {
  return STATSIG_EXPERIMENTS.subscriptionMessage;
}
