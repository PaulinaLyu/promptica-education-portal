import { articleRepository } from "@entities/article";
import type { Article } from "@entities/article";
import type { ArticleProgress, ExerciseProgress } from "@entities/progress";
import { calculateArticleCompletion, progressRepository } from "@entities/progress";
import { computed, ref, watch } from "vue";
import type { ComputedRef, Ref } from "vue";

interface UseArticlePageReturn {
  readonly article: Readonly<Ref<Article | null>>;
  readonly isLoading: Readonly<Ref<boolean>>;
  readonly completionSummary: ComputedRef<
    ReturnType<typeof calculateArticleCompletion> | null
  >;
  readonly nextArticle: ComputedRef<Article | undefined>;
  readonly rendererKey: ComputedRef<string>;
  readonly handleExerciseProgressChange: (
    exerciseId: string,
    exerciseProgress: ExerciseProgress,
  ) => Promise<void>;
  readonly handleProgressCleared: () => void;
}

export const useArticlePage = (
  articleId: Readonly<Ref<string>>,
): UseArticlePageReturn => {
  const article = ref<Article | null>(null);
  const articles = ref<readonly Article[]>([]);
  const articleProgress = ref<ArticleProgress>({});
  const isLoading = ref(true);
  const resetVersion = ref(0);

  const loadArticle = async (nextArticleId: string): Promise<void> => {
    isLoading.value = true;
    const [loadedArticle, loadedArticles, progressData] = await Promise.all([
      articleRepository.getById(nextArticleId),
      articleRepository.getAll(),
      progressRepository.loadProgress(),
    ]);

    article.value = loadedArticle;
    articles.value = loadedArticles;
    articleProgress.value = progressData[nextArticleId] ?? {};
    isLoading.value = false;
  };

  const completionSummary = computed(() =>
    article.value
      ? calculateArticleCompletion(article.value, articleProgress.value)
      : null,
  );

  const currentArticleIndex = computed(() =>
    article.value
      ? articles.value.findIndex(
          (currentArticle) => currentArticle.id === article.value?.id,
        )
      : -1,
  );

  const nextArticle = computed(() =>
    currentArticleIndex.value >= 0
      ? articles.value[currentArticleIndex.value + 1]
      : undefined,
  );

  const rendererKey = computed(
    () => `${article.value?.id ?? "article"}-${resetVersion.value}`,
  );

  const handleExerciseProgressChange = async (
    exerciseId: string,
    exerciseProgress: ExerciseProgress,
  ): Promise<void> => {
    if (!article.value) {
      return;
    }

    await progressRepository.saveExerciseProgress(
      article.value.id,
      exerciseId,
      exerciseProgress,
    );
    articleProgress.value = {
      ...articleProgress.value,
      [exerciseId]: exerciseProgress,
    };
  };

  const handleProgressCleared = (): void => {
    articleProgress.value = {};
    resetVersion.value += 1;
  };

  watch(articleId, loadArticle, { immediate: true });

  return {
    article,
    isLoading,
    completionSummary,
    nextArticle,
    rendererKey,
    handleExerciseProgressChange,
    handleProgressCleared,
  };
};
