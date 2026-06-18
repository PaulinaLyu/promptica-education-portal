import type { ExerciseProgress, ProgressData } from "../types";

export interface ProgressRepository {
  loadProgress(): Promise<ProgressData>;
  saveProgress(progressData: ProgressData): Promise<void>;
  getExerciseProgress(articleId: string, exerciseId: string): Promise<ExerciseProgress | null>;
  saveExerciseProgress(
    articleId: string,
    exerciseId: string,
    exerciseProgress: ExerciseProgress,
  ): Promise<void>;
  clearProgress(): Promise<void>;
}
