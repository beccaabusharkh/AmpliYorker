import articlesData from "../data/articles.json";

export type Article = {
  id: string;
  headline: string;
  deck: string;
  body: string[];
  publishedAt: string;
  topic: string;
  author: string;
  authorName: string;
  narrated?: boolean;
  podcast?: boolean;
  sponsored?: boolean;
};

export const articles: Article[] = articlesData as Article[];

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export function getFeaturedArticle(): Article {
  return articles[0];
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
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
