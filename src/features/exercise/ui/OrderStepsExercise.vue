<script setup lang="ts">
import type { ExerciseBlock, OrderStep, OrderStepsExerciseContent } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { BaseButton } from "@shared";
import { computed, ref, watch } from "vue";
import { VueDraggable } from "vue-draggable-plus";

interface PropsOrderStepsExercise {
  readonly block: ExerciseBlock;
}

const props = defineProps<PropsOrderStepsExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const orderedSteps = ref<OrderStep[]>([]);
const isSubmitted = ref(false);

const content = computed(() => props.block.orderSteps);

const buildInitialSteps = (exerciseContent: OrderStepsExerciseContent): OrderStep[] => {
  const steps = [...exerciseContent.steps];

  return steps.length > 1 ? steps.reverse() : steps;
};

const resetSteps = (): void => {
  if (!content.value) {
    orderedSteps.value = [];
    return;
  }

  orderedSteps.value = buildInitialSteps(content.value);
  isSubmitted.value = false;
};

watch(content, resetSteps, { immediate: true });

const hasSteps = computed(() => orderedSteps.value.length > 0);

const isCorrect = computed(() => {
  if (!content.value || orderedSteps.value.length !== content.value.steps.length) {
    return false;
  }

  return orderedSteps.value.every((step, index) => step.id === content.value?.steps[index]?.id);
});

const resultTitle = computed(() => (isCorrect.value ? "Порядок верный" : "Порядок не совпал"));

const resultText = computed(() =>
  isCorrect.value
    ? "Все шаги стоят в правильной последовательности."
    : "Переставь шаги так, чтобы они отражали рабочий порядок проверки.",
);

const submitAnswer = (): void => {
  if (!hasSteps.value) {
    return;
  }

  isSubmitted.value = true;
  emit("progress-change", {
    completed: isCorrect.value,
    score: isCorrect.value ? 1 : 0,
  });
};

const retryAnswer = (): void => {
  resetSteps();
};

const moveStep = (fromIndex: number, toIndex: number): void => {
  if (isSubmitted.value || toIndex < 0 || toIndex >= orderedSteps.value.length) {
    return;
  }

  const steps = [...orderedSteps.value];
  const [movedStep] = steps.splice(fromIndex, 1);

  if (!movedStep) {
    return;
  }

  steps.splice(toIndex, 0, movedStep);
  orderedSteps.value = steps;
};

const getStepClasses = (stepId: string, index: number): string[] => {
  if (!isSubmitted.value) {
    return ["border-stone-200 bg-white hover:border-stone-300"];
  }

  const isInCorrectPosition = stepId === content.value?.steps[index]?.id;

  return [isInCorrectPosition ? "border-accent bg-accent/20" : "border-red-200 bg-red-50"];
};
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: расставь шаги по порядку"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # расставь по порядку
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>

    <form class="mt-4" @submit.prevent="submitAnswer">
      <p class="text-sm font-bold text-stone-950">
        {{ content.question }}
      </p>

      <VueDraggable
        v-model="orderedSteps"
        class="mt-4 space-y-2"
        handle=".order-steps-drag-handle"
        ghost-class="opacity-50"
        :animation="150"
        :disabled="isSubmitted"
      >
        <div
          v-for="(step, index) in orderedSteps"
          :key="step.id"
          class="flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-sm text-stone-800 shadow-sm transition"
          :class="getStepClasses(step.id, index)"
        >
          <span
            class="order-steps-drag-handle inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-full bg-stone-950 text-sm font-black text-white active:cursor-grabbing"
            aria-hidden="true"
          >
            {{ index + 1 }}
          </span>

          <span class="min-w-0 flex-1 font-semibold leading-5">
            {{ step.label }}
          </span>

          <div class="flex shrink-0 items-center gap-1">
            <button
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-full text-sm font-bold text-stone-500 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:pointer-events-none disabled:opacity-30"
              :disabled="isSubmitted || index === 0"
              :aria-label="`Поднять шаг «${step.label}»`"
              @click="moveStep(index, index - 1)"
            >
              ↑
            </button>

            <button
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-full text-sm font-bold text-stone-500 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:pointer-events-none disabled:opacity-30"
              :disabled="isSubmitted || index === orderedSteps.length - 1"
              :aria-label="`Опустить шаг «${step.label}»`"
              @click="moveStep(index, index + 1)"
            >
              ↓
            </button>
          </div>
        </div>
      </VueDraggable>

      <BaseButton
        class="mt-4"
        size="sm"
        type="submit"
        :disabled="!hasSteps || isSubmitted"
      >
        Проверить порядок
      </BaseButton>
    </form>

    <div
      v-if="isSubmitted"
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
      OrderSteps упражнение не настроено.
    </p>
  </section>
</template>
