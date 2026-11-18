import { getArticleById } from "./articles";
import { SUBSCRIPTION_MESSAGE_COPY, STATSIG_EXPERIMENTS } from "./statsig/catalog";
import { getSubscriptionMessageVariant } from "./statsig/evaluate";
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
  const session = loadSession();
  if (!isLoggedIn()) {
    return "Simulated paywall — register or log in, then subscribe to read this premium brief.";
  }
  if (!hasActiveSubscription()) {
    const variant = getSubscriptionMessageVariant(surface);
    return SUBSCRIPTION_MESSAGE_COPY[variant];
  }
  if (session.subscription.status === "canceled") {
    return "Simulated paywall — subscription canceled; resubscribe to regain access.";
  }
  if (session.subscription.status === "expired") {
    return "Simulated paywall — subscription expired. Renew on Account or advance demo time.";
  }
  return "Simulated paywall";
}

export function paywallMessageExperimentId(): string {
  return STATSIG_EXPERIMENTS.subscriptionMessage;
}
