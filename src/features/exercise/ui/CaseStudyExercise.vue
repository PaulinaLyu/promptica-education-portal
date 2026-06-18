<script setup lang="ts">
import type { CaseStudyStep, ExerciseBlock } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { BaseButton } from "@shared";
import { computed, ref, watch } from "vue";

interface PropsCaseStudyExercise {
  readonly block: ExerciseBlock;
}

const props = defineProps<PropsCaseStudyExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const selectedOptionByStepId = ref<Record<string, string>>({});
const isSubmitted = ref(false);

const content = computed(() => props.block.caseStudy);

const resetCaseStudy = (): void => {
  selectedOptionByStepId.value = {};
  isSubmitted.value = false;
};

watch(content, resetCaseStudy, { immediate: true });

const answeredStepCount = computed(() =>
  content.value?.steps.filter((step) => Boolean(selectedOptionByStepId.value[step.id])).length ?? 0,
);

const hasAllAnswers = computed(
  () => Boolean(content.value?.steps.length) && answeredStepCount.value === content.value?.steps.length,
);

const correctAnswerCount = computed(
  () =>
    content.value?.steps.filter(
      (step) => selectedOptionByStepId.value[step.id] === step.correctOptionId,
    ).length ?? 0,
);

const isCorrect = computed(
  () => Boolean(content.value?.steps.length) && correctAnswerCount.value === content.value?.steps.length,
);

const resultTitle = computed(() => (isCorrect.value ? "Кейс решён" : "Кейс пока не сошёлся"));

const resultText = computed(() =>
  isCorrect.value
    ? "Все решения усиливают исходный промпт."
    : "Посмотри фидбек по шагам и выбери варианты, которые точнее закрывают цель.",
);

const selectOption = (stepId: string, optionId: string): void => {
  if (isSubmitted.value) {
    return;
  }

  selectedOptionByStepId.value = {
    ...selectedOptionByStepId.value,
    [stepId]: optionId,
  };
};

const getSelectedOptionId = (stepId: string): string => selectedOptionByStepId.value[stepId] ?? "";

const isOptionSelected = (stepId: string, optionId: string): boolean =>
  getSelectedOptionId(stepId) === optionId;

const isOptionCorrect = (step: CaseStudyStep, optionId: string): boolean =>
  step.correctOptionId === optionId;

const getSelectedOptionFeedback = (step: CaseStudyStep): string => {
  const selectedOptionId = getSelectedOptionId(step.id);
  const selectedOption = step.options.find((option) => option.id === selectedOptionId);

  return selectedOption?.feedback ?? "";
};

const getOptionClasses = (step: CaseStudyStep, optionId: string): string[] => {
  const selected = isOptionSelected(step.id, optionId);
  const correct = isOptionCorrect(step, optionId);

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
    score: isCorrect.value ? 1 : 0,
  });
};

const retryAnswer = (): void => {
  resetCaseStudy();
};
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: кейс-стади"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # кейс-стади
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>

    <div class="mt-4 grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div class="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
        <p class="text-xs font-black uppercase tracking-[0.12em] text-stone-500">
          Ситуация
        </p>
        <p class="mt-2 text-sm leading-6 text-stone-700">
          {{ content.scenario }}
        </p>
      </div>

      <div class="rounded-2xl border border-stone-200 bg-white px-4 py-4">
        <p class="text-xs font-black uppercase tracking-[0.12em] text-stone-500">
          Слабый промпт
        </p>
        <blockquote class="mt-2 text-sm font-semibold leading-6 text-stone-950">
          «{{ content.weakPrompt }}»
        </blockquote>
        <p class="mt-3 text-xs font-black uppercase tracking-[0.12em] text-stone-500">
          Цель
        </p>
        <p class="mt-2 text-sm leading-6 text-stone-700">
          {{ content.goal }}
        </p>
      </div>
    </div>

    <form class="mt-5 space-y-4" @submit.prevent="submitAnswer">
      <fieldset
        v-for="(step, index) in content.steps"
        :key="step.id"
        :disabled="isSubmitted"
        class="rounded-2xl border border-stone-200 px-4 py-4"
      >
        <legend class="px-1 text-sm font-bold text-stone-950">
          {{ index + 1 }}. {{ step.title }}
        </legend>
        <p class="mt-2 text-sm leading-6 text-stone-700">
          {{ step.question }}
        </p>

        <div class="mt-3 space-y-2">
          <button
            v-for="option in step.options"
            :key="option.id"
            type="button"
            class="w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold leading-5 text-stone-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed"
            :class="getOptionClasses(step, option.id)"
            :aria-pressed="isOptionSelected(step.id, option.id)"
            @click="selectOption(step.id, option.id)"
          >
            {{ option.label }}
          </button>
        </div>

        <p
          v-if="isSubmitted && getSelectedOptionId(step.id)"
          class="mt-3 rounded-xl border px-3 py-2 text-sm leading-6"
          :class="
            isOptionCorrect(step, getSelectedOptionId(step.id))
              ? 'border-accent bg-accent/20 text-stone-800'
              : 'border-red-200 bg-red-50 text-red-900'
          "
        >
          {{ getSelectedOptionFeedback(step) }}
        </p>
      </fieldset>

      <BaseButton size="sm" type="submit" :disabled="!hasAllAnswers || isSubmitted">
        Проверить кейс
      </BaseButton>
    </form>

    <div
      v-if="isSubmitted"
      class="mt-4 rounded-xl border px-4 py-3"
      :class="isCorrect ? 'border-accent bg-accent/20' : 'border-red-200 bg-red-50'"
      aria-live="polite"
    >
      <p class="text-sm font-bold text-stone-950">
        {{ resultTitle }} · {{ correctAnswerCount }}/{{ content.steps.length }}
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
      CaseStudy упражнение не настроено.
    </p>
  </section>
</template>
