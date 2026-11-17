const STORAGE_PREFIX = "ampli-daily-progress:";

export function getReadingProgress(articleId: string): number {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${articleId}`);
  const value = raw ? Number.parseFloat(raw) : 0;
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

export function setReadingProgress(articleId: string, percent: number): void {
  const clamped = Math.min(100, Math.max(0, percent));
  localStorage.setItem(`${STORAGE_PREFIX}${articleId}`, String(Math.round(clamped)));
}

export function attachReadingProgress(articleId: string, articleEl: HTMLElement, barEl: HTMLElement): () => void {
  const update = (): void => {
    const rect = articleEl.getBoundingClientRect();
    const viewport = window.innerHeight;
    const total = articleEl.scrollHeight;
    const scrolled = Math.min(total, Math.max(0, -rect.top + viewport));
    const percent = total > 0 ? (scrolled / total) * 100 : 0;
    setReadingProgress(articleId, percent);
    barEl.style.width = `${getReadingProgress(articleId)}%`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}
