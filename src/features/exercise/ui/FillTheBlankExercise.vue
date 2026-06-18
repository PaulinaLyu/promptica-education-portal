<script setup lang="ts">
import type { ExerciseBlock, FillTheBlankAnswer } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { BaseButton } from "@shared";
import { computed, ref, watch } from "vue";

interface PropsFillTheBlankExercise {
  readonly block: ExerciseBlock;
}

interface TextSegment {
  readonly kind: "text";
  readonly value: string;
}

interface BlankSegment {
  readonly kind: "blank";
  readonly id: string;
}

type FillTheBlankSegment = TextSegment | BlankSegment;

const props = defineProps<PropsFillTheBlankExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const userAnswers = ref<Record<string, string>>({});
const isSubmitted = ref(false);

const content = computed(() => props.block.fillTheBlank);

const normalizeAnswer = (answer: string): string => answer.trim().toLowerCase();

const parseTextSegments = (text: string): FillTheBlankSegment[] => {
  const placeholderPattern = /\{\{([\w-]+)\}\}/g;
  const segments: FillTheBlankSegment[] = [];
  let lastIndex = 0;
  let match = placeholderPattern.exec(text);

  while (match) {
    const [placeholder, blankId] = match;

    if (match.index > lastIndex) {
      segments.push({
        kind: "text",
        value: text.slice(lastIndex, match.index),
      });
    }

    segments.push({
      kind: "blank",
      id: blankId,
    });

    lastIndex = match.index + placeholder.length;
    match = placeholderPattern.exec(text);
  }

  if (lastIndex < text.length) {
    segments.push({
      kind: "text",
      value: text.slice(lastIndex),
    });
  }

  return segments;
};

const blankById = computed<ReadonlyMap<string, FillTheBlankAnswer>>(
  () => new Map(content.value?.blanks.map((blank) => [blank.id, blank]) ?? []),
);

const segments = computed<FillTheBlankSegment[]>(() =>
  content.value ? parseTextSegments(content.value.text) : [],
);

const resetAnswers = (): void => {
  userAnswers.value = Object.fromEntries(content.value?.blanks.map((blank) => [blank.id, ""]) ?? []);
  isSubmitted.value = false;
};

watch(content, resetAnswers, { immediate: true });

const hasAllAnswers = computed(() =>
  content.value?.blanks.every((blank) => normalizeAnswer(userAnswers.value[blank.id] ?? "").length > 0),
);

const isBlankCorrect = (blankId: string): boolean => {
  const blank = blankById.value.get(blankId);

  if (!blank) {
    return false;
  }

  const normalizedUserAnswer = normalizeAnswer(userAnswers.value[blankId] ?? "");

  return blank.answers.some((answer) => normalizeAnswer(answer) === normalizedUserAnswer);
};

const isCorrect = computed(() => content.value?.blanks.every((blank) => isBlankCorrect(blank.id)) ?? false);

const resultTitle = computed(() => (isCorrect.value ? "Верно" : "Почти, но нет"));

const resultText = computed(() =>
  isCorrect.value
    ? "Все пропуски заполнены правильно."
    : "Проверь ответы: засчитывается только полностью правильное заполнение.",
);

const getBlankHint = (blankId: string): string => blankById.value.get(blankId)?.hint ?? "";

const getInputClasses = (blankId: string): string[] => {
  if (!isSubmitted.value) {
    return ["border-accent bg-accent/30 focus:border-stone-950"];
  }

  return isBlankCorrect(blankId)
    ? ["border-accent bg-accent/30"]
    : ["border-red-300 bg-red-50 text-red-900"];
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
  resetAnswers();
};
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: вставь слово"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # вставь слово
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>

    <form class="mt-4" @submit.prevent="submitAnswer">
      <fieldset :disabled="isSubmitted" class="space-y-3">
        <legend class="sr-only">
          Заполни пропуски в тексте
        </legend>

        <p class="text-base font-semibold leading-8 text-stone-800">
          <template v-for="(segment, index) in segments" :key="`${segment.kind}-${index}`">
            <span v-if="segment.kind === 'text'">{{ segment.value }}</span>
            <input
              v-else
              v-model="userAnswers[segment.id]"
              class="mx-1 inline-flex min-h-10 w-24 rounded-xl border px-4 text-center text-sm font-bold uppercase text-stone-950 outline-none transition placeholder:text-stone-500 disabled:cursor-not-allowed"
              :class="getInputClasses(segment.id)"
              type="text"
              placeholder="..."
              autocomplete="off"
              :aria-label="`Пропуск: ${getBlankHint(segment.id)}`"
            />
          </template>
        </p>

        <ul v-if="content.blanks.length > 0" class="space-y-1 text-xs leading-5 text-stone-500">
          <li v-for="blank in content.blanks" :key="blank.id">
            Подсказка: {{ blank.hint }}
          </li>
        </ul>
      </fieldset>

      <BaseButton
        class="mt-4"
        size="sm"
        type="submit"
        :disabled="!hasAllAnswers || isSubmitted"
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
      FillTheBlank упражнение не настроено.
    </p>
  </section>
</template>
