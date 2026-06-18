import CaseStudyExercise from "../ui/CaseStudyExercise.vue";
import FillTheBlankExercise from "../ui/FillTheBlankExercise.vue";
import MatchPairsExercise from "../ui/MatchPairsExercise.vue";
import MultipleChoiceExercise from "../ui/MultipleChoiceExercise.vue";
import OrderStepsExercise from "../ui/OrderStepsExercise.vue";
import PromptBuilderExercise from "../ui/PromptBuilderExercise.vue";
import PromptSimulatorExercise from "../ui/PromptSimulatorExercise.vue";
import RiskClassificationExercise from "../ui/RiskClassificationExercise.vue";
import SpotTheHallucinationExercise from "../ui/SpotTheHallucinationExercise.vue";
import TrueFalseExercise from "../ui/TrueFalseExercise.vue";
import type { ExerciseDefinition } from "./types";

export const MULTIPLE_CHOICE_EXERCISE_TYPE = "multiple-choice";
export const MATCH_PAIRS_EXERCISE_TYPE = "match-pairs";
export const FILL_THE_BLANK_EXERCISE_TYPE = "fill-the-blank";
export const TRUE_FALSE_EXERCISE_TYPE = "true-false";
export const ORDER_STEPS_EXERCISE_TYPE = "order-steps";
export const PROMPT_BUILDER_EXERCISE_TYPE = "prompt-builder";
export const CASE_STUDY_EXERCISE_TYPE = "case-study";
export const PROMPT_SIMULATOR_EXERCISE_TYPE = "prompt-simulator";
export const SPOT_THE_HALLUCINATION_EXERCISE_TYPE = "spot-the-hallucination";
export const RISK_CLASSIFICATION_EXERCISE_TYPE = "risk-classification";

export const exerciseRegistry = new Map<string, ExerciseDefinition>([
  [
    RISK_CLASSIFICATION_EXERCISE_TYPE,
    {
      type: RISK_CLASSIFICATION_EXERCISE_TYPE,
      component: RiskClassificationExercise,
    },
  ],
  [
    SPOT_THE_HALLUCINATION_EXERCISE_TYPE,
    {
      type: SPOT_THE_HALLUCINATION_EXERCISE_TYPE,
      component: SpotTheHallucinationExercise,
    },
  ],
  [
    PROMPT_SIMULATOR_EXERCISE_TYPE,
    {
      type: PROMPT_SIMULATOR_EXERCISE_TYPE,
      component: PromptSimulatorExercise,
    },
  ],
  [
    CASE_STUDY_EXERCISE_TYPE,
    {
      type: CASE_STUDY_EXERCISE_TYPE,
      component: CaseStudyExercise,
    },
  ],
  [
    PROMPT_BUILDER_EXERCISE_TYPE,
    {
      type: PROMPT_BUILDER_EXERCISE_TYPE,
      component: PromptBuilderExercise,
    },
  ],
  [
    ORDER_STEPS_EXERCISE_TYPE,
    {
      type: ORDER_STEPS_EXERCISE_TYPE,
      component: OrderStepsExercise,
    },
  ],
  [
    TRUE_FALSE_EXERCISE_TYPE,
    {
      type: TRUE_FALSE_EXERCISE_TYPE,
      component: TrueFalseExercise,
    },
  ],
  [
    FILL_THE_BLANK_EXERCISE_TYPE,
    {
      type: FILL_THE_BLANK_EXERCISE_TYPE,
      component: FillTheBlankExercise,
    },
  ],
  [
    MATCH_PAIRS_EXERCISE_TYPE,
    {
      type: MATCH_PAIRS_EXERCISE_TYPE,
      component: MatchPairsExercise,
    },
  ],
  [
    MULTIPLE_CHOICE_EXERCISE_TYPE,
    {
      type: MULTIPLE_CHOICE_EXERCISE_TYPE,
      component: MultipleChoiceExercise,
    },
  ],
]);

export const getExerciseDefinition = (type: string): ExerciseDefinition | undefined =>
  exerciseRegistry.get(type);
