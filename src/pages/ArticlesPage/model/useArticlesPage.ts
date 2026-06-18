import { articleRepository } from "@entities/article";
import type { Article } from "@entities/article";
import type { ArticleCompletionSummary, ProgressData } from "@entities/progress";
import { calculateArticleCompletion, progressRepository } from "@entities/progress";
import { computed, onMounted, ref } from "vue";
import type { ComputedRef, Ref } from "vue";

interface UseArticlesPageReturn {
  readonly articles: Readonly<Ref<readonly Article[]>>;
  readonly articleCount: ComputedRef<number>;
  readonly completionSummaries: ComputedRef<
    Readonly<Record<string, ArticleCompletionSummary>>
  >;
  readonly resetProgress: () => void;
}

export const useArticlesPage = (): UseArticlesPageReturn => {
  const articles = ref<readonly Article[]>([]);
  const progressData = ref<ProgressData>({});

  const articleCount = computed(() => articles.value.length);
  const completionSummaries = computed<
    Readonly<Record<string, ArticleCompletionSummary>>
  >(() =>
    Object.fromEntries(
      articles.value.map((article) => [
        article.id,
        calculateArticleCompletion(article, progressData.value[article.id] ?? {}),
      ]),
    ),
  );

  onMounted(async () => {
    const [loadedArticles, loadedProgressData] = await Promise.all([
      articleRepository.getAll(),
      progressRepository.loadProgress(),
    ]);

    articles.value = loadedArticles;
    progressData.value = loadedProgressData;
  });

  const resetProgress = (): void => {
    progressData.value = {};
  };

  return {
    articles,
    articleCount,
    completionSummaries,
    resetProgress,
  };
};
