<script setup lang="ts">
import type { ExerciseBlock } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { BaseButton } from "@shared";
import { computed, ref } from "vue";

interface PropsMultipleChoiceExercise {
  readonly block: ExerciseBlock;
}

const props = defineProps<PropsMultipleChoiceExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const selectedOptionId = ref("");
const selectedOptionIds = ref<string[]>([]);
const isSubmitted = ref(false);

const content = computed(() => props.block.multipleChoice);

const selectedIds = computed<readonly string[]>(() => {
  if (!content.value) {
    return [];
  }

  return content.value.mode === "single"
    ? selectedOptionId.value
      ? [selectedOptionId.value]
      : []
    : selectedOptionIds.value;
});

const correctOptionIds = computed<ReadonlySet<string>>(
  () => new Set(content.value?.correctOptionIds ?? []),
);

const hasSelection = computed(() => selectedIds.value.length > 0);

const isCorrect = computed(() => {
  if (!content.value) {
    return false;
  }

  const selectedSet = new Set(selectedIds.value);

  return (
    selectedSet.size === correctOptionIds.value.size &&
    [...correctOptionIds.value].every((optionId) => selectedSet.has(optionId))
  );
});

const score = computed(() => {
  if (!content.value || selectedIds.value.length === 0 || correctOptionIds.value.size === 0) {
    return 0;
  }

  const selectedSet = new Set(selectedIds.value);
  const correctSelectionCount = [...selectedSet].filter((optionId) =>
    correctOptionIds.value.has(optionId),
  ).length;
  const incorrectSelectionCount = [...selectedSet].filter(
    (optionId) => !correctOptionIds.value.has(optionId),
  ).length;

  return Math.max(0, (correctSelectionCount - incorrectSelectionCount) / correctOptionIds.value.size);
});

const scorePercentage = computed(() => Math.round(score.value * 100));

const resultTitle = computed(() => (isCorrect.value ? "Верно" : "Почти, но нет"));

const resultText = computed(() =>
  isCorrect.value
    ? "Ответ полностью совпал с правильным набором."
    : "Частичный балл начисляется за правильные варианты и снижается за лишние.",
);

const submitAnswer = (): void => {
  if (!hasSelection.value) {
    return;
  }

  isSubmitted.value = true;
  emit("progress-change", {
    completed: isCorrect.value,
    score: score.value,
  });
};

const retryAnswer = (): void => {
  selectedOptionId.value = "";
  selectedOptionIds.value = [];
  isSubmitted.value = false;
};

const getOptionClasses = (optionId: string): string[] => {
  const isSelected = selectedIds.value.includes(optionId);
  const isCorrectOption = correctOptionIds.value.has(optionId);

  if (!isSubmitted.value) {
    return [
      isSelected ? "border-stone-950 bg-stone-50" : "border-stone-200 bg-white",
      "hover:border-stone-300 hover:bg-stone-50",
    ];
  }

  if (isCorrect.value && isCorrectOption) {
    return ["border-accent bg-accent/20"];
  }

  if (isSelected) {
    return [isCorrect.value ? "border-accent bg-accent/20" : "border-red-200 bg-red-50"];
  }

  return ["border-stone-200 bg-white opacity-70"];
};
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: выбор ответа"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # выбор ответа
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>

    <form class="mt-4 space-y-2" @submit.prevent="submitAnswer">
      <fieldset :disabled="isSubmitted" class="space-y-2">
        <legend class="mb-3 text-sm font-bold text-stone-950">
          {{ content.question }}
        </legend>

        <label
          v-for="option in content.options"
          :key="option.id"
          class="flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition"
          :class="getOptionClasses(option.id)"
          :for="`${block.id}-${option.id}`"
        >
          <input
            v-if="content.mode === 'single'"
            :id="`${block.id}-${option.id}`"
            v-model="selectedOptionId"
            class="mt-0.5 size-4 border-stone-300 accent-accent disabled:cursor-not-allowed"
            type="radio"
            :name="block.id"
            :value="option.id"
          />

          <input
            v-else
            :id="`${block.id}-${option.id}`"
            v-model="selectedOptionIds"
            class="mt-0.5 size-4 rounded border-stone-300 accent-accent disabled:cursor-not-allowed"
            type="checkbox"
            :value="option.id"
          />

          <span class="leading-5 text-stone-800">
            {{ option.label }}
          </span>
        </label>
      </fieldset>

      <BaseButton
        class="mt-2"
        size="sm"
        type="submit"
        :disabled="!hasSelection || isSubmitted"
      >
        Проверить
      </BaseButton>
    </form>

    <div
      v-if="isSubmitted"
      class="mt-4 rounded-xl border px-4 py-3"
      :class="isCorrect ? 'border-accent bg-accent/20' : 'border-red-200 bg-red-50'"
      aria-live="polite"
    >
      <p class="text-sm font-bold text-stone-950">
        {{ resultTitle }} · {{ scorePercentage }}%
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
      MultipleChoice упражнение не настроено.
    </p>
  </section>
</template>
