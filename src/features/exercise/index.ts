export {
  CASE_STUDY_EXERCISE_TYPE,
  exerciseRegistry,
  FILL_THE_BLANK_EXERCISE_TYPE,
  getExerciseDefinition,
  MATCH_PAIRS_EXERCISE_TYPE,
  MULTIPLE_CHOICE_EXERCISE_TYPE,
  ORDER_STEPS_EXERCISE_TYPE,
  PROMPT_BUILDER_EXERCISE_TYPE,
  PROMPT_SIMULATOR_EXERCISE_TYPE,
  RISK_CLASSIFICATION_EXERCISE_TYPE,
  SPOT_THE_HALLUCINATION_EXERCISE_TYPE,
  TRUE_FALSE_EXERCISE_TYPE,
} from "./model/registry";
export type { ExerciseDefinition } from "./model/types";
export { default as ExerciseRenderer } from "./ui/ExerciseRenderer.vue";
