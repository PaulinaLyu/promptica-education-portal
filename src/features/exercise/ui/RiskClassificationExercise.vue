<script setup lang="ts">
import type { ExerciseBlock, RiskClassificationScenario } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { BaseButton } from "@shared";
import { computed, ref, watch } from "vue";

interface PropsRiskClassificationExercise {
  readonly block: ExerciseBlock;
}

const props = defineProps<PropsRiskClassificationExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const selectedCategoryByScenarioId = ref<Record<string, string>>({});
const isSubmitted = ref(false);

const content = computed(() => props.block.riskClassification);

const resetClassification = (): void => {
  selectedCategoryByScenarioId.value = {};
  isSubmitted.value = false;
};

watch(content, resetClassification, { immediate: true });

const answeredScenarioCount = computed(
  () =>
    content.value?.scenarios.filter((scenario) =>
      Boolean(selectedCategoryByScenarioId.value[scenario.id]),
    ).length ?? 0,
);

const hasAllAnswers = computed(
  () =>
    Boolean(content.value?.scenarios.length) &&
    answeredScenarioCount.value === content.value?.scenarios.length,
);

const correctAnswerCount = computed(
  () =>
    content.value?.scenarios.filter(
      (scenario) =>
        selectedCategoryByScenarioId.value[scenario.id] === scenario.correctCategoryId,
    ).length ?? 0,
);

const score = computed(() => {
  const scenarioCount = content.value?.scenarios.length ?? 0;

  return scenarioCount > 0 ? correctAnswerCount.value / scenarioCount : 0;
});

const scorePercentage = computed(() => Math.round(score.value * 100));
const isCorrect = computed(() => score.value === 1);

const resultTitle = computed(() =>
  isCorrect.value ? "Риски классифицированы верно" : "Есть спорные классификации",
);

const resultText = computed(() =>
  isCorrect.value
    ? "Все сценарии попали в подходящие категории риска."
    : "Посмотри подсказки у сценариев и пересобери классификацию.",
);

const selectCategory = (scenarioId: string, categoryId: string): void => {
  if (isSubmitted.value) {
    return;
  }

  selectedCategoryByScenarioId.value = {
    ...selectedCategoryByScenarioId.value,
    [scenarioId]: categoryId,
  };
};

const getSelectedCategoryId = (scenarioId: string): string =>
  selectedCategoryByScenarioId.value[scenarioId] ?? "";

const isCategorySelected = (scenarioId: string, categoryId: string): boolean =>
  getSelectedCategoryId(scenarioId) === categoryId;

const isCategoryCorrect = (scenario: RiskClassificationScenario, categoryId: string): boolean =>
  scenario.correctCategoryId === categoryId;

const getCategoryClasses = (
  scenario: RiskClassificationScenario,
  categoryId: string,
): string[] => {
  const selected = isCategorySelected(scenario.id, categoryId);
  const correct = isCategoryCorrect(scenario, categoryId);

  if (!isSubmitted.value) {
    return [
      selected ? "border-stone-950 bg-stone-50" : "border-stone-200 bg-white",
      "hover:border-stone-300 hover:bg-stone-50",
    ];
  }

  if (correct) {
    return ["border-accent bg-accent/20"];
  }

  if (selected) {
    return ["border-red-200 bg-red-50"];
  }

  return ["border-stone-200 bg-white opacity-70"];
};

const submitAnswer = (): void => {
  if (!hasAllAnswers.value) {
    return;
  }

  isSubmitted.value = true;
  emit("progress-change", {
    completed: isCorrect.value,
    score: score.value,
  });
};

const retryAnswer = (): void => {
  resetClassification();
};
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: классификация риска"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # классификация риска
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>

    <div class="mt-4 grid gap-2 md:grid-cols-3">
      <div
        v-for="category in content.categories"
        :key="category.id"
        class="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
      >
        <p class="text-sm font-black text-stone-950">
          {{ category.label }}
        </p>
        <p class="mt-1 text-xs leading-5 text-stone-600">
          {{ category.description }}
        </p>
      </div>
    </div>

    <form class="mt-5 space-y-4" @submit.prevent="submitAnswer">
      <fieldset :disabled="isSubmitted" class="space-y-4">
        <legend class="text-sm font-bold text-stone-950">
          {{ content.question }}
        </legend>

        <div
          v-for="scenario in content.scenarios"
          :key="scenario.id"
          class="rounded-2xl border border-stone-200 px-4 py-4"
        >
          <p class="text-sm font-semibold leading-6 text-stone-800">
            {{ scenario.text }}
          </p>

          <div class="mt-3 grid gap-2 md:grid-cols-3">
            <button
              v-for="category in content.categories"
              :key="category.id"
              type="button"
              class="rounded-xl border px-3 py-2 text-left text-sm font-semibold leading-5 text-stone-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed"
              :class="getCategoryClasses(scenario, category.id)"
              :aria-pressed="isCategorySelected(scenario.id, category.id)"
              @click="selectCategory(scenario.id, category.id)"
            >
              {{ category.label }}
            </button>
          </div>

          <p
            v-if="isSubmitted"
            class="mt-3 rounded-xl border px-3 py-2 text-sm leading-6"
            :class="
              isCategoryCorrect(scenario, getSelectedCategoryId(scenario.id))
                ? 'border-accent bg-accent/20 text-stone-800'
                : 'border-red-200 bg-red-50 text-red-900'
            "
          >
            {{ scenario.feedback }}
          </p>
        </div>
      </fieldset>

      <BaseButton size="sm" type="submit" :disabled="!hasAllAnswers || isSubmitted">
        Проверить классификацию
      </BaseButton>
    </form>

    <div
      v-if="isSubmitted"
      class="mt-4 rounded-xl border px-4 py-3"
      :class="isCorrect ? 'border-accent bg-accent/20' : 'border-red-200 bg-red-50'"
      aria-live="polite"
    >
      <p class="text-sm font-bold text-stone-950">
        {{ resultTitle }} · {{ correctAnswerCount }}/{{ content.scenarios.length }} ·
        {{ scorePercentage }}%
      </p>
      <p class="mt-1 text-sm leading-6 text-stone-700">
        {{ resultText }}
      </p>
      <p v-if="isCorrect" class="mt-2 text-sm leading-6 text-stone-700">
        {{ content.explanation }}
      </p>

      <BaseButton
        v-else
        class="mt-3"
        size="sm"
        variant="secondary"
        type="button"
        @click="retryAnswer"
      >
        Попробовать ещё раз
      </BaseButton>
    </div>
  </section>

  <section
    v-else
    class="rounded-2xl border border-red-200 bg-red-50 px-5 py-5"
    aria-label="Упражнение не настроено"
  >
    <p class="text-sm font-semibold text-red-800">
      RiskClassification упражнение не настроено.
    </p>
  </section>
</template>
