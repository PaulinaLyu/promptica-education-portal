import { cloneProgressData, createEmptyProgressData } from "../types";
import type { ExerciseProgress, ProgressData } from "../types";
import type { ProgressStorage } from "./ProgressStorage";

const DEFAULT_STORAGE_KEY = "promptica-progress";

const isExerciseProgress = (value: unknown): value is ExerciseProgress => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const progress = value as Partial<Record<keyof ExerciseProgress, unknown>>;

  return typeof progress.completed === "boolean" && typeof progress.score === "number";
};

const parseProgressData = (value: unknown): ProgressData => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return createEmptyProgressData();
  }

  const progressData: Record<string, Record<string, ExerciseProgress>> = {};

  Object.entries(value).forEach(([articleId, articleProgress]) => {
    if (!articleProgress || typeof articleProgress !== "object" || Array.isArray(articleProgress)) {
      return;
    }

    const parsedArticleProgress: Record<string, ExerciseProgress> = {};

    Object.entries(articleProgress).forEach(([exerciseId, exerciseProgress]) => {
      if (isExerciseProgress(exerciseProgress)) {
        parsedArticleProgress[exerciseId] = { ...exerciseProgress };
      }
    });

    progressData[articleId] = parsedArticleProgress;
  });

  return progressData;
};

export class LocalStorageProgressStorage implements ProgressStorage {
  private readonly storageKey: string;

  constructor(storageKey = DEFAULT_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  load(): ProgressData {
    const serializedProgress = localStorage.getItem(this.storageKey);

    if (!serializedProgress) {
      return createEmptyProgressData();
    }

    try {
      return parseProgressData(JSON.parse(serializedProgress));
    } catch {
      return createEmptyProgressData();
    }
  }

  save(data: ProgressData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cloneProgressData(data)));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
