import type { Article, ExerciseBlock } from "@entities/article";
import type { ArticleCompletionSummary, ArticleProgress } from "./types";
import { createEmptyArticleCompletionSummary } from "./types";

const getExerciseBlocks = (article: Article): readonly ExerciseBlock[] =>
  article.blocks.filter((block): block is ExerciseBlock => block.type === "exercise");

export const calculateArticleCompletion = (
  article: Article,
  articleProgress: ArticleProgress = {},
): ArticleCompletionSummary => {
  const exerciseBlocks = getExerciseBlocks(article);
  const totalExerciseCount = exerciseBlocks.length;

  if (totalExerciseCount === 0) {
    return createEmptyArticleCompletionSummary();
  }

  const completedExerciseCount = exerciseBlocks.filter(
    (exerciseBlock) => articleProgress[exerciseBlock.id]?.completed === true,
  ).length;

  return {
    completedExerciseCount,
    totalExerciseCount,
    percentage: Math.round((completedExerciseCount / totalExerciseCount) * 100),
    completed: completedExerciseCount === totalExerciseCount,
  };
};
