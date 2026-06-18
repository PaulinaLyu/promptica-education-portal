import type { ProgressData } from "../types";

export interface ProgressStorage {
  load(): ProgressData;
  save(data: ProgressData): void;
  clear(): void;
}
