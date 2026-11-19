import { getArticleById } from "../articles";
import { getReadingProgress } from "../reading-progress";
import { getDemoRunId } from "./context";
import { trackDemoEvent } from "./track";

const MILESTONES = [25, 50, 75, 90, 100] as const;

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
  let activeSeconds = 0;
  let lastTick = performance.now();
  let ticking = false;

  const onInteraction = (): void => {
    userInteracted = true;
    if (!ticking) {
      ticking = true;
      lastTick = performance.now();
    }
  };

  const pauseActiveTime = (): void => {
    ticking = false;
  };

  const accumulateTime = (): void => {
    if (!ticking || document.hidden) {
      return;
    }
    const now = performance.now();
    const delta = (now - lastTick) / 1000;
    if (delta >= 0.25) {
      activeSeconds += delta;
      lastTick = now;
    }
  };

  const measure = (): void => {
    accumulateTime();
    const rect = bodyEl.getBoundingClientRect();
    const viewport = window.innerHeight;
    const total = bodyEl.scrollHeight;
    const scrolled = Math.min(total, Math.max(0, -rect.top + viewport));
    const percent = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;

    if (!userInteracted) {
      return;
    }

    const readingSeconds = Math.round(activeSeconds * 10) / 10;

    for (const milestone of MILESTONES) {
      if (percent >= milestone && !fired.has(milestone)) {
        fired.add(milestone);
        persistFired(sessionKey, fired);
        const insertId = `read-article:${articleId}:${milestone}:${getDemoRunId()}`;
        trackDemoEvent(
          "Read Article",
          {
            article_id: article.id,
            author_id: article.author,
            topic_id: article.topic,
            content_progress_percent: milestone,
            active_reading_seconds: readingSeconds,
            discovery_source: "direct",
            recommendation_set_id: null,
            reading_source: "new_read",
            content_type: article.sponsored ? "sponsored" : "editorial",
            sponsor_id: article.sponsored ? article.author : null,
          },
          "interactive_demo",
          insertId,
        );
      }
    }
  };

  window.addEventListener("scroll", measure, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("wheel", onInteraction, { passive: true });
  window.addEventListener("keydown", onInteraction);
  window.addEventListener("touchstart", onInteraction, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      accumulateTime();
      pauseActiveTime();
    }
  });
  window.addEventListener("blur", () => {
    accumulateTime();
    pauseActiveTime();
  });
  window.addEventListener("focus", onInteraction);

  const interval = window.setInterval(measure, 1000);
  measure();

  return () => {
    window.clearInterval(interval);
    window.removeEventListener("scroll", measure);
    window.removeEventListener("resize", measure);
    window.removeEventListener("wheel", onInteraction);
    window.removeEventListener("keydown", onInteraction);
    window.removeEventListener("touchstart", onInteraction);
    window.removeEventListener("focus", onInteraction);
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