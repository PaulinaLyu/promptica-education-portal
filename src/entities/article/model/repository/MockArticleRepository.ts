import { mockArticles } from "@content";
import type { Article } from "../types";
import type { ArticleRepository } from "./ArticleRepository";

export class MockArticleRepository implements ArticleRepository {
  async getAll(): Promise<readonly Article[]> {
    return mockArticles;
  }

  async getById(id: string): Promise<Article | null> {
    return mockArticles.find((article) => article.id === id) ?? null;
  }
}
