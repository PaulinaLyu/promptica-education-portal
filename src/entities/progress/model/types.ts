export interface ExerciseProgress {
  readonly completed: boolean;
  readonly score: number;
}

export type ArticleProgress = Readonly<Record<string, ExerciseProgress>>;

export type ProgressData = Readonly<Record<string, ArticleProgress>>;

export interface ArticleCompletionSummary {
  readonly completedExerciseCount: number;
  readonly totalExerciseCount: number;
  readonly percentage: number;
  readonly completed: boolean;
}

export const createEmptyProgressData = (): ProgressData => ({});

export const cloneProgressData = (progressData: ProgressData): ProgressData =>
  Object.fromEntries(
    Object.entries(progressData).map(([articleId, articleProgress]) => [
      articleId,
      Object.fromEntries(
        Object.entries(articleProgress).map(([exerciseId, exerciseProgress]) => [
          exerciseId,
          { ...exerciseProgress },
        ]),
      ),
    ]),
  );

export const createEmptyArticleCompletionSummary = (): ArticleCompletionSummary => ({
  completedExerciseCount: 0,
  totalExerciseCount: 0,
  percentage: 0,
  completed: false,
});
