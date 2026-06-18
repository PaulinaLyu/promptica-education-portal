import { cloneProgressData, createEmptyProgressData } from "../types";
import type { ProgressData } from "../types";
import type { ProgressStorage } from "./ProgressStorage";

export class InMemoryProgressStorage implements ProgressStorage {
  private progressData: ProgressData = createEmptyProgressData();

  load(): ProgressData {
    return cloneProgressData(this.progressData);
  }

  save(data: ProgressData): void {
    this.progressData = cloneProgressData(data);
  }

  clear(): void {
    this.progressData = createEmptyProgressData();
  }
}
