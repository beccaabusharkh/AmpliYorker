import { getArticleById } from "../articles";
import { getReadingProgress } from "../reading-progress";
import { trackDemoEvent } from "./track";

const MILESTONES = [10, 25, 50, 75, 90, 100] as const;

export function attachArticleReadTracking(articleId: string, bodyEl: HTMLElement): () => void {
  const article = getArticleById(articleId);
  if (!article) {
    return () => undefined;
  }

  const sessionKey = `ampli-daily-read-milestones:${articleId}`;
  const fired = new Set<number>(loadFired(sessionKey));
  const restoredPercent = getReadingProgress(articleId);
  if (restoredPercent > 0) {
    MILESTONES.forEach((m) => {
      if (m <= restoredPercent) {
        fired.add(m);
      }
    });
    persistFired(sessionKey, fired);
  }
  let userInteracted = false;

  const onInteraction = (): void => {
    userInteracted = true;
  };

  const measure = (): void => {
    const rect = bodyEl.getBoundingClientRect();
    const viewport = window.innerHeight;
    const total = bodyEl.scrollHeight;
    const scrolled = Math.min(total, Math.max(0, -rect.top + viewport));
    const percent = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;

    if (!userInteracted) {
      return;
    }

    for (const milestone of MILESTONES) {
      if (percent >= milestone && !fired.has(milestone)) {
        fired.add(milestone);
        persistFired(sessionKey, fired);
        trackDemoEvent("Read Article", {
          article_id: article.id,
          author_id: article.author,
          topic_id: article.topic,
          content_progress_percent: milestone,
          active_reading_seconds: 0,
          discovery_source: "direct",
          recommendation_set_id: null,
          reading_source: "new_read",
          content_type: article.sponsored ? "sponsored" : "editorial",
          sponsor_id: article.sponsored ? article.author : null,
        });
      }
    }
  };

  window.addEventListener("scroll", measure, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("wheel", onInteraction, { passive: true });
  window.addEventListener("keydown", onInteraction);
  window.addEventListener("touchstart", onInteraction, { passive: true });
  measure();

  return () => {
    window.removeEventListener("scroll", measure);
    window.removeEventListener("resize", measure);
    window.removeEventListener("wheel", onInteraction);
    window.removeEventListener("keydown", onInteraction);
    window.removeEventListener("touchstart", onInteraction);
  };
}

function loadFired(key: string): number[] {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as number[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistFired(key: string, fired: Set<number>): void {
  sessionStorage.setItem(key, JSON.stringify([...fired].sort((a, b) => a - b)));
}