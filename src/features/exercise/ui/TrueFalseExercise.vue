<script setup lang="ts">
import type { ExerciseBlock } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { computed, ref, watch } from "vue";

interface PropsTrueFalseExercise {
  readonly block: ExerciseBlock;
}

const props = defineProps<PropsTrueFalseExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const selectedAnswer = ref<boolean | null>(null);
const isSubmitted = ref(false);

const content = computed(() => props.block.trueFalse);

watch(
  content,
  () => {
    selectedAnswer.value = null;
    isSubmitted.value = false;
  },
  { immediate: true },
);

const hasSelection = computed(() => selectedAnswer.value !== null);
const isCorrect = computed(() => selectedAnswer.value === content.value?.correctAnswer);

const resultTitle = computed(() => (isCorrect.value ? "Верно" : "Неверно"));

const resultText = computed(() =>
  isCorrect.value ? "Ответ совпал с правильным." : "Сравни утверждение с объяснением ниже.",
);

const selectAnswer = (answer: boolean): void => {
  if (isSubmitted.value) {
    return;
  }

  selectedAnswer.value = answer;
  isSubmitted.value = true;
  emit("progress-change", {
    completed: isCorrect.value,
    score: isCorrect.value ? 1 : 0,
  });
};

const getAnswerClasses = (answer: boolean): string[] => {
  const isSelected = selectedAnswer.value === answer;

  if (!isSubmitted.value) {
    return [
      isSelected ? "border-stone-950 bg-stone-50" : "border-stone-200 bg-white",
      "hover:border-stone-300 hover:bg-stone-50",
    ];
  }

  if (answer === content.value?.correctAnswer) {
    return ["border-accent bg-accent/20"];
  }

  if (isSelected) {
    return ["border-red-200 bg-red-50"];
  }

  return ["border-stone-200 bg-white opacity-70"];
};
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: верно или нет"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # верно или нет?
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>

    <p class="mt-4 text-sm font-bold leading-6 text-stone-950">
      {{ content.statement }}
    </p>

    <div class="mt-4 grid gap-2 sm:grid-cols-2">
      <button
        type="button"
        class="min-h-12 rounded-2xl border px-4 text-sm font-bold text-stone-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed"
        :class="getAnswerClasses(true)"
        :disabled="isSubmitted"
        @click="selectAnswer(true)"
      >
        Верно
      </button>

      <button
        type="button"
        class="min-h-12 rounded-2xl border px-4 text-sm font-bold text-stone-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed"
        :class="getAnswerClasses(false)"
        :disabled="isSubmitted"
        @click="selectAnswer(false)"
      >
        Неверно
      </button>
    </div>

    <div
      v-if="hasSelection"
      class="mt-4 rounded-xl border px-4 py-3"
      :class="isCorrect ? 'border-accent bg-accent/20' : 'border-red-200 bg-red-50'"
      aria-live="polite"
    >
      <p class="text-sm font-bold text-stone-950">
        {{ resultTitle }} · {{ isCorrect ? "1/1" : "0/1" }}
      </p>
      <p class="mt-1 text-sm leading-6 text-stone-700">
        {{ resultText }}
      </p>
      <p class="mt-2 text-sm leading-6 text-stone-700">
        {{ content.explanation }}
      </p>
    </div>
  </section>

  <section
    v-else
    class="rounded-2xl border border-red-200 bg-red-50 px-5 py-5"
    aria-label="Упражнение не настроено"
  >
    <p class="text-sm font-semibold text-red-800">
      TrueFalse упражнение не настроено.
    </p>
  </section>
</template>
