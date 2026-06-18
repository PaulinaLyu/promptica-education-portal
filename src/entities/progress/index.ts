export {
  DefaultProgressRepository,
  progressRepository,
} from "./model/repository";
export { InMemoryProgressStorage, LocalStorageProgressStorage } from "./model/storage";
export { calculateArticleCompletion } from "./model/calculateArticleCompletion";
export type { ProgressRepository } from "./model/repository";
export type { ProgressStorage } from "./model/storage";
export type {
  ArticleCompletionSummary,
  ArticleProgress,
  ExerciseProgress,
  ProgressData,
} from "./model/types";
