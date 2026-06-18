export type ArticleDifficulty = "Базовый" | "Средний";

export interface TextBlock {
  readonly id: string;
  readonly type: "text";
  readonly text: string;
}

export interface HeadingBlock {
  readonly id: string;
  readonly type: "heading";
  readonly text: string;
  readonly level: 2 | 3;
}

export interface ImageBlock {
  readonly id: string;
  readonly type: "image";
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
}

export interface ExerciseBlock {
  readonly id: string;
  readonly type: "exercise";
  readonly exerciseType: string;
  readonly title: string;
  readonly description: string;
  readonly multipleChoice?: MultipleChoiceExerciseContent;
  readonly matchPairs?: MatchPairsExerciseContent;
  readonly fillTheBlank?: FillTheBlankExerciseContent;
  readonly trueFalse?: TrueFalseExerciseContent;
  readonly orderSteps?: OrderStepsExerciseContent;
  readonly promptBuilder?: PromptBuilderExerciseContent;
  readonly caseStudy?: CaseStudyExerciseContent;
  readonly promptSimulator?: PromptSimulatorExerciseContent;
  readonly spotTheHallucination?: SpotTheHallucinationExerciseContent;
  readonly riskClassification?: RiskClassificationExerciseContent;
}

export type MultipleChoiceMode = "single" | "multiple";

export interface MultipleChoiceOption {
  readonly id: string;
  readonly label: string;
}

export interface MultipleChoiceExerciseContent {
  readonly mode: MultipleChoiceMode;
  readonly question: string;
  readonly options: readonly MultipleChoiceOption[];
  readonly correctOptionIds: readonly string[];
  readonly explanation: string;
}

export interface MatchPairsPair {
  readonly id: string;
  readonly prompt: string;
  readonly match: string;
}

export interface MatchPairsExerciseContent {
  readonly question: string;
  readonly pairs: readonly MatchPairsPair[];
  readonly explanation: string;
}

export interface FillTheBlankAnswer {
  readonly id: string;
  readonly answers: readonly string[];
  readonly hint: string;
}

export interface FillTheBlankExerciseContent {
  readonly text: string;
  readonly blanks: readonly FillTheBlankAnswer[];
  readonly explanation: string;
}

export interface TrueFalseExerciseContent {
  readonly statement: string;
  readonly correctAnswer: boolean;
  readonly explanation: string;
}

export interface OrderStep {
  readonly id: string;
  readonly label: string;
}

export interface OrderStepsExerciseContent {
  readonly question: string;
  readonly steps: readonly OrderStep[];
  readonly explanation: string;
}

export interface PromptBuilderOption {
  readonly id: string;
  readonly label: string;
  readonly promptText: string;
}

export interface PromptBuilderCategory {
  readonly id: string;
  readonly title: string;
  readonly options: readonly PromptBuilderOption[];
}

export interface PromptBuilderExerciseContent {
  readonly intro: string;
  readonly categories: readonly PromptBuilderCategory[];
  readonly emptyPreviewText: string;
  readonly completedText: string;
}

export interface CaseStudyOption {
  readonly id: string;
  readonly label: string;
  readonly feedback: string;
}

export interface CaseStudyStep {
  readonly id: string;
  readonly title: string;
  readonly question: string;
  readonly options: readonly CaseStudyOption[];
  readonly correctOptionId: string;
}

export interface CaseStudyExerciseContent {
  readonly scenario: string;
  readonly weakPrompt: string;
  readonly goal: string;
  readonly steps: readonly CaseStudyStep[];
  readonly explanation: string;
}

export type PromptQualityLevel = "weak" | "medium" | "strong";

export interface PromptSimulatorResponse {
  readonly title: string;
  readonly response: string;
  readonly feedback: string;
}

export interface PromptSimulatorPatternGroup {
  readonly patterns: readonly string[];
  readonly result: PromptSimulatorResponse;
}

export interface PromptSimulatorExerciseContent {
  readonly scenario: string;
  readonly placeholder: string;
  readonly weak: PromptSimulatorPatternGroup;
  readonly medium: PromptSimulatorPatternGroup;
  readonly strong: PromptSimulatorPatternGroup;
}

export interface TextRange {
  readonly start: number;
  readonly end: number;
}

export interface SpotTheHallucinationExerciseContent {
  readonly instruction: string;
  readonly text: string;
  readonly hallucinations: readonly TextRange[];
  readonly explanation: string;
}

export interface RiskClassificationCategory {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

export interface RiskClassificationScenario {
  readonly id: string;
  readonly text: string;
  readonly correctCategoryId: string;
  readonly feedback: string;
}

export interface RiskClassificationExerciseContent {
  readonly question: string;
  readonly categories: readonly RiskClassificationCategory[];
  readonly scenarios: readonly RiskClassificationScenario[];
  readonly explanation: string;
}

export type ArticleBlock = TextBlock | HeadingBlock | ImageBlock | ExerciseBlock;

export interface Article {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly symbol: string;
  readonly difficulty: ArticleDifficulty;
  readonly readingTimeMinutes: number;
  readonly isFeatured?: boolean;
  readonly blocks: readonly ArticleBlock[];
}
