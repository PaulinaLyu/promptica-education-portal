import { MockArticleRepository } from "./MockArticleRepository";

export { MockArticleRepository } from "./MockArticleRepository";
export type { ArticleRepository } from "./ArticleRepository";

export const articleRepository = new MockArticleRepository();
