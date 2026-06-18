<script setup lang="ts">
import type { ExerciseBlock, MatchPairsExerciseContent } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { BaseButton } from "@shared";
import { computed, ref, watch } from "vue";
import { VueDraggable } from "vue-draggable-plus";

interface PropsMatchPairsExercise {
  readonly block: ExerciseBlock;
}

interface MatchPairsAnswer {
  readonly id: string;
  readonly label: string;
}

const props = defineProps<PropsMatchPairsExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const answers = ref<MatchPairsAnswer[]>([]);
const isSubmitted = ref(false);

const content = computed(() => props.block.matchPairs);

const buildInitialAnswers = (exerciseContent: MatchPairsExerciseContent): MatchPairsAnswer[] => {
  const initialAnswers = exerciseContent.pairs.map((pair) => ({
    id: pair.id,
    label: pair.match,
  }));

  return initialAnswers.length > 1 ? initialAnswers.reverse() : initialAnswers;
};

const resetAnswers = (): void => {
  if (!content.value) {
    answers.value = [];
    return;
  }

  answers.value = buildInitialAnswers(content.value);
  isSubmitted.value = false;
};

watch(content, resetAnswers, { immediate: true });

const hasAnswers = computed(() => answers.value.length > 0);

const isCorrect = computed(() => {
  if (!content.value || answers.value.length !== content.value.pairs.length) {
    return false;
  }

  return answers.value.every((answer, index) => answer.id === content.value?.pairs[index]?.id);
});

const resultTitle = computed(() => (isCorrect.value ? "Верно" : "Пары не совпали"));

const resultText = computed(() =>
  isCorrect.value
    ? "Все соответствия собраны правильно."
    : "Перетащи карточки справа так, чтобы каждая стояла напротив своей пары.",
);

const submitAnswer = (): void => {
  if (!hasAnswers.value) {
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
    aria-label="Упражнение: сопоставление пар"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # сопоставь пары
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

      <div class="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div class="space-y-2">
          <p class="text-xs font-black uppercase tracking-[0.12em] text-stone-500">
            Условия
          </p>

          <div
            v-for="(pair, index) in content.pairs"
            :key="pair.id"
            class="flex min-h-16 items-center rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-800"
          >
            <span
              class="mr-3 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-stone-500"
            >
              {{ index + 1 }}
            </span>
            {{ pair.prompt }}
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-black uppercase tracking-[0.12em] text-stone-500">
            Ответы
          </p>

          <VueDraggable
            v-model="answers"
            class="space-y-2"
            handle=".match-pairs-drag-handle"
            ghost-class="opacity-50"
            :animation="150"
            :disabled="isSubmitted"
          >
            <div
              v-for="answer in answers"
              :key="answer.id"
              class="flex min-h-16 items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm text-stone-800 shadow-sm transition"
              :class="
                isSubmitted
                  ? isCorrect
                    ? 'border-accent bg-accent/20'
                    : 'border-red-200 bg-red-50'
                  : 'border-stone-200 hover:border-stone-300'
              "
            >
              <span
                class="match-pairs-drag-handle inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-sm font-black text-stone-500 active:cursor-grabbing"
                aria-hidden="true"
              >
                ::
              </span>
              <span class="leading-5">
                {{ answer.label }}
              </span>
            </div>
          </VueDraggable>
        </div>
      </div>

      <BaseButton
        class="mt-4"
        size="sm"
        type="submit"
        :disabled="!hasAnswers || isSubmitted"
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
        {{ resultTitle }} · {{ isCorrect ? '1/1' : '0/1' }}
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
      MatchPairs упражнение не настроено.
    </p>
  </section>
</template>
