import articlesData from "../data/articles.json";

export type Article = {
  id: string;
  headline: string;
  deck: string;
  body: string[];
  publishedAt: string;
};

export const articles: Article[] = articlesData;

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export function getFeaturedArticle(): Article {
  return articles[0];
}
