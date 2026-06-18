import type { Component } from "vue";

export interface ExerciseDefinition {
  readonly type: string;
  readonly component: Component;
}
