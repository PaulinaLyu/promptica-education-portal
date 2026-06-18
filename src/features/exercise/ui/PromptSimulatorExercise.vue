<script setup lang="ts">
import type { ExerciseBlock, PromptQualityLevel, PromptSimulatorResponse } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { BaseButton } from "@shared";
import { computed, ref, watch } from "vue";

interface PropsPromptSimulatorExercise {
  readonly block: ExerciseBlock;
}

const QUALITY_SCORE: Record<PromptQualityLevel, number> = {
  weak: 0.34,
  medium: 0.67,
  strong: 1,
};

const props = defineProps<PropsPromptSimulatorExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const userPrompt = ref("");
const simulatedLevel = ref<PromptQualityLevel | null>(null);

const content = computed(() => props.block.promptSimulator);

watch(
  content,
  () => {
    userPrompt.value = "";
    simulatedLevel.value = null;
  },
  { immediate: true },
);

const normalizedPrompt = computed(() => userPrompt.value.trim().toLowerCase());
const hasPrompt = computed(() => normalizedPrompt.value.length > 0);

const hasPatternMatch = (patterns: readonly string[]): boolean =>
  patterns.some((pattern) => normalizedPrompt.value.includes(pattern.toLowerCase()));

const detectQualityLevel = (): PromptQualityLevel => {
  if (!content.value) {
    return "weak";
  }

  if (hasPatternMatch(content.value.strong.patterns)) {
    return "strong";
  }

  if (hasPatternMatch(content.value.medium.patterns)) {
    return "medium";
  }

  return "weak";
};

const simulatedResponse = computed<PromptSimulatorResponse | null>(() => {
  if (!content.value || !simulatedLevel.value) {
    return null;
  }

  return content.value[simulatedLevel.value].result;
});

const resultBadge = computed(() => {
  if (simulatedLevel.value === "strong") {
    return "Сильный промпт";
  }

  if (simulatedLevel.value === "medium") {
    return "Средний промпт";
  }

  return "Слабый промпт";
});

const resultClasses = computed(() => {
  if (simulatedLevel.value === "strong") {
    return "border-accent bg-accent/20";
  }

  if (simulatedLevel.value === "medium") {
    return "border-amber-200 bg-amber-50";
  }

  return "border-red-200 bg-red-50";
});

const simulatePrompt = (): void => {
  if (!hasPrompt.value) {
    return;
  }

  const qualityLevel = detectQualityLevel();
  simulatedLevel.value = qualityLevel;

  emit("progress-change", {
    completed: true,
    score: QUALITY_SCORE[qualityLevel],
  });
};

const resetSimulation = (): void => {
  userPrompt.value = "";
  simulatedLevel.value = null;
};
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: симулятор промпта"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # симулятор промпта
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>

    <div class="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
      <p class="text-xs font-black uppercase tracking-[0.12em] text-stone-500">
        Сценарий
      </p>
      <p class="mt-2 text-sm leading-6 text-stone-700">
        {{ content.scenario }}
      </p>
    </div>

    <form class="mt-4" @submit.prevent="simulatePrompt">
      <label class="text-sm font-bold text-stone-950" :for="`${block.id}-prompt`">
        Твой промпт
      </label>
      <textarea
        :id="`${block.id}-prompt`"
        v-model="userPrompt"
        class="mt-2 min-h-32 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
        :placeholder="content.placeholder"
      />

      <div class="mt-3 flex flex-wrap gap-2">
        <BaseButton size="sm" type="submit" :disabled="!hasPrompt">
          Запустить симуляцию
        </BaseButton>
        <BaseButton
          v-if="simulatedResponse"
          size="sm"
          variant="secondary"
          type="button"
          @click="resetSimulation"
        >
          Сбросить
        </BaseButton>
      </div>
    </form>

    <div
      v-if="simulatedResponse"
      class="mt-4 rounded-xl border px-4 py-3"
      :class="resultClasses"
      aria-live="polite"
    >
      <p class="text-xs font-black uppercase tracking-[0.12em] text-stone-500">
        {{ resultBadge }}
      </p>
      <p class="mt-2 text-sm font-bold text-stone-950">
        {{ simulatedResponse.title }}
      </p>
      <p class="mt-2 whitespace-pre-line text-sm leading-6 text-stone-700">
        {{ simulatedResponse.response }}
      </p>
      <p class="mt-3 text-sm leading-6 text-stone-700">
        {{ simulatedResponse.feedback }}
      </p>
    </div>
  </section>

  <section
    v-else
    class="rounded-2xl border border-red-200 bg-red-50 px-5 py-5"
    aria-label="Упражнение не настроено"
  >
    <p class="text-sm font-semibold text-red-800">
      PromptSimulator упражнение не настроено.
    </p>
  </section>
</template>
