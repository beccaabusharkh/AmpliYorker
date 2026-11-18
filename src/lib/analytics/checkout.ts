let activeCheckoutId: string | null = null;

export function getOrCreateCheckoutId(): string {
  if (!activeCheckoutId) {
    activeCheckoutId = crypto.randomUUID();
  }
  return activeCheckoutId;
}

export function clearCheckoutId(): void {
  activeCheckoutId = null;
}