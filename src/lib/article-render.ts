import { baseUrl } from "./paths";
import type { Article } from "./articles";

export function renderArticleBodyContent(article: Article): string {
  const parts: string[] = [];
  const inlineByAfter = new Map((article.inlineFigures ?? []).map((fig) => [fig.afterParagraph, fig]));
  const quotesByAfter = new Map((article.pullQuotes ?? []).map((q) => [q.afterParagraph, q]));

  article.body.forEach((paragraph, index) => {
    const paragraphIndex = index + 1;
    const isFirst = index === 0;
    const text = escapeHtml(paragraph);
    if (isFirst) {
      const firstChar = text.charAt(0);
      const rest = text.slice(1);
      parts.push(`<p class="drop-cap"><span class="drop-cap__letter" aria-hidden="true">${firstChar}</span>${rest}</p>`);
    } else {
      parts.push(`<p>${text}</p>`);
    }
    if (quotesByAfter.has(paragraphIndex)) {
      const quote = quotesByAfter.get(paragraphIndex)!;
      const cite = quote.attribution ? `<cite>— ${escapeHtml(quote.attribution)}</cite>` : "";
      parts.push(
        `<blockquote class="pull-quote"><p>${escapeHtml(quote.quote)}</p>${cite}</blockquote>`,
      );
    }
    if (inlineByAfter.has(paragraphIndex)) {
      const fig = inlineByAfter.get(paragraphIndex)!;
      parts.push(`
        <figure class="inline-figure">
          <img src="${baseUrl}${escapeAttr(fig.src)}" alt="${escapeAttr(fig.alt)}" loading="lazy" width="800" height="450" />
          <figcaption>${escapeHtml(fig.credit)}</figcaption>
        </figure>`);
    }
  });
  return parts.join("");
}

export function renderArticleHero(article: Article): string {
  if (!article.heroImage) {
    return "";
  }
  const img = article.heroImage;
  const ratio = img.aspectRatio === "3:2" ? "3 / 2" : img.aspectRatio === "4:3" ? "4 / 3" : "16 / 9";
  return `
    <figure class="article-hero" style="aspect-ratio: ${ratio}">
      <img src="${baseUrl}${escapeAttr(img.src)}" alt="${escapeAttr(img.alt)}" loading="eager" />
      <figcaption>${escapeHtml(img.credit)}</figcaption>
    </figure>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}