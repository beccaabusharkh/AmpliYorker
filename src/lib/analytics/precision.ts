/** DOM roots that emit explicit `trackDemoEvent` calls — exclude from element autocapture. */
export const PRECISION_INTERACTION_ROOTS = [
  "[data-precision-event]",
  "[data-login-form]",
  "[data-register-form]",
  "[data-newsletter-form]",
  "[data-chat-form]",
  "[data-checkout-form]",
  "[data-save-article]",
  "[data-select-plan]",
  "[data-header-search]",
  "[data-billing-form]",
  "[data-plan-form]",
  "[data-cancel-form]",
  "[data-logout]",
  ".ask-daily-panel",
  ".account-support-chat",
] as const;

export function isPrecisionTrackedElement(element: Element): boolean {
  return PRECISION_INTERACTION_ROOTS.some((selector) => element.closest(selector));
}