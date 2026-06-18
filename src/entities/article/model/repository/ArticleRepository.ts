import type { Article } from "../types";

export interface ArticleRepository {
  getAll(): Promise<readonly Article[]>;
  getById(id: string): Promise<Article | null>;
}
