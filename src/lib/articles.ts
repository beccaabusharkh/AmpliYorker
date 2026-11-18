import articlesData from "../data/articles.json";

export type HeroImage = {
  src: string;
  alt: string;
  credit: string;
  aspectRatio: "16:9" | "3:2" | "4:3";
};

export type InlineFigure = {
  afterParagraph: number;
  src: string;
  alt: string;
  credit: string;
};

export type PullQuote = {
  afterParagraph: number;
  quote: string;
  attribution?: string;
};

export type Article = {
  id: string;
  headline: string;
  deck: string;
  body: string[];
  publishedAt: string;
  topic: string;
  author: string;
  authorName: string;
  wordCountBand?: "short" | "feature";
  previewParagraphCount?: number;
  kicker?: string;
  narrated?: boolean;
  podcast?: boolean;
  sponsored?: boolean;
  premium?: boolean;
  heroImage?: HeroImage;
  inlineFigures?: InlineFigure[];
  pullQuotes?: PullQuote[];
};

export const articles: Article[] = articlesData as Article[];

const FEATURED_ID = "cohort-compound-interest";

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export function getFeaturedArticle(): Article {
  return getArticleById(FEATURED_ID) ?? articles[0];
}

export function getAllArticles(): Article[] {
  return [...articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function searchArticles(query: string): Article[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }
  const needle = trimmed.toLowerCase();
  return getAllArticles().filter((article) => {
    const haystack = [article.headline, article.deck, ...article.body].join(" ").toLowerCase();
    return haystack.includes(needle);
  });
}

export function getArticlesByTopic(topic: string): Article[] {
  return getAllArticles().filter((article) => article.topic === topic);
}

export function getArticlesByAuthor(author: string): Article[] {
  return getAllArticles().filter((article) => article.author === author);
}

export function getRecommendations(article: Article, limit = 3): Article[] {
  const sameTopic = getAllArticles().filter(
    (candidate) => candidate.id !== article.id && candidate.topic === article.topic,
  );
  const others = getAllArticles().filter(
    (candidate) => candidate.id !== article.id && candidate.topic !== article.topic,
  );
  return [...sameTopic, ...others].slice(0, limit);
}

export function formatTopicLabel(slug: string): string {
  if (slug === "podcast") {
    return "Podcasts";
  }
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getArticleHeroPath(article: Article): string | undefined {
  return article.heroImage?.src;
}

export function getArticleThumbAlt(article: Article): string {
  const alt = article.heroImage?.alt?.trim();
  if (alt) {
    return alt.length > 80 ? `${alt.slice(0, 77)}...` : alt;
  }
  return article.headline.length > 80 ? `${article.headline.slice(0, 77)}...` : article.headline;
}

export function formatEditionDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}