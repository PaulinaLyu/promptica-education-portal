import type { ExerciseProgress, ProgressData } from "../types";
import type { ProgressStorage } from "../storage";
import type { ProgressRepository } from "./ProgressRepository";

export class DefaultProgressRepository implements ProgressRepository {
  private readonly storage: ProgressStorage;

  constructor(storage: ProgressStorage) {
    this.storage = storage;
  }

  async loadProgress(): Promise<ProgressData> {
    return this.storage.load();
  }

  async saveProgress(progressData: ProgressData): Promise<void> {
    this.storage.save(progressData);
  }

  async getExerciseProgress(
    articleId: string,
    exerciseId: string,
  ): Promise<ExerciseProgress | null> {
    const progressData = this.storage.load();

    return progressData[articleId]?.[exerciseId] ?? null;
  }

  async saveExerciseProgress(
    articleId: string,
    exerciseId: string,
    exerciseProgress: ExerciseProgress,
  ): Promise<void> {
    const progressData = this.storage.load();
    const articleProgress = progressData[articleId] ?? {};

    this.storage.save({
      ...progressData,
      [articleId]: {
        ...articleProgress,
        [exerciseId]: { ...exerciseProgress },
      },
    });
  }

  async clearProgress(): Promise<void> {
    this.storage.clear();
  }
}
