<script setup lang="ts">
import type { ExerciseBlock, TextRange } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { BaseButton } from "@shared";
import { computed, ref, watch } from "vue";

interface PropsSpotTheHallucinationExercise {
  readonly block: ExerciseBlock;
}

interface TextSegment {
  readonly id: string;
  readonly text: string;
  readonly isSelected: boolean;
  readonly isHallucination: boolean;
}

const props = defineProps<PropsSpotTheHallucinationExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const textContainer = ref<HTMLElement | null>(null);
const selectedRanges = ref<TextRange[]>([]);
const isSubmitted = ref(false);

const content = computed(() => props.block.spotTheHallucination);

watch(
  content,
  () => {
    selectedRanges.value = [];
    isSubmitted.value = false;
  },
  { immediate: true },
);

const rangesOverlap = (firstRange: TextRange, secondRange: TextRange): boolean =>
  firstRange.start < secondRange.end && secondRange.start < firstRange.end;

const clampRange = (range: TextRange, textLength: number): TextRange => ({
  start: Math.max(0, Math.min(range.start, textLength)),
  end: Math.max(0, Math.min(range.end, textLength)),
});

const normalizeRange = (range: TextRange): TextRange => ({
  start: Math.min(range.start, range.end),
  end: Math.max(range.start, range.end),
});

const trimSelectedRange = (range: TextRange, text: string): TextRange | null => {
  let start = range.start;
  let end = range.end;

  while (start < end && /\s/.test(text[start] ?? "")) {
    start += 1;
  }

  while (end > start && /\s/.test(text[end - 1] ?? "")) {
    end -= 1;
  }

  return start < end ? { start, end } : null;
};

const mergeRanges = (ranges: readonly TextRange[]): TextRange[] => {
  const sortedRanges = [...ranges].sort((firstRange, secondRange) => firstRange.start - secondRange.start);
  const mergedRanges: TextRange[] = [];

  for (const range of sortedRanges) {
    const lastRange = mergedRanges[mergedRanges.length - 1];

    if (!lastRange || range.start > lastRange.end) {
      mergedRanges.push(range);
      continue;
    }

    mergedRanges[mergedRanges.length - 1] = {
      start: lastRange.start,
      end: Math.max(lastRange.end, range.end),
    };
  }

  return mergedRanges;
};

const getSelectionRange = (): TextRange | null => {
  if (!content.value || !textContainer.value) {
    return null;
  }

  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const selectionRange = selection.getRangeAt(0);

  if (!textContainer.value.contains(selectionRange.commonAncestorContainer)) {
    return null;
  }

  const leadingRange = document.createRange();
  leadingRange.selectNodeContents(textContainer.value);
  leadingRange.setEnd(selectionRange.startContainer, selectionRange.startOffset);

  const start = leadingRange.toString().length;
  const end = start + selectionRange.toString().length;
  const range = clampRange(normalizeRange({ start, end }), content.value.text.length);

  return trimSelectedRange(range, content.value.text);
};

const addCurrentSelection = (): void => {
  if (isSubmitted.value) {
    return;
  }

  const selectionRange = getSelectionRange();
  window.getSelection()?.removeAllRanges();

  if (!selectionRange) {
    return;
  }

  selectedRanges.value = mergeRanges([...selectedRanges.value, selectionRange]);
};

const clearSelections = (): void => {
  selectedRanges.value = [];
  isSubmitted.value = false;
};

const hasSelections = computed(() => selectedRanges.value.length > 0);

const hallucinationRanges = computed<readonly TextRange[]>(() => content.value?.hallucinations ?? []);

const coveredHallucinationCount = computed(
  () =>
    hallucinationRanges.value.filter((hallucinationRange) =>
      selectedRanges.value.some((selectedRange) => rangesOverlap(selectedRange, hallucinationRange)),
    ).length,
);

const wrongSelectionCount = computed(
  () =>
    selectedRanges.value.filter(
      (selectedRange) =>
        !hallucinationRanges.value.some((hallucinationRange) =>
          rangesOverlap(selectedRange, hallucinationRange),
        ),
    ).length,
);

const isCorrect = computed(
  () =>
    hallucinationRanges.value.length > 0 &&
    coveredHallucinationCount.value === hallucinationRanges.value.length &&
    wrongSelectionCount.value === 0,
);

const score = computed(() => {
  if (hallucinationRanges.value.length === 0 || wrongSelectionCount.value > 0) {
    return 0;
  }

  return coveredHallucinationCount.value / hallucinationRanges.value.length;
});

const resultTitle = computed(() => (isCorrect.value ? "Все выдумки найдены" : "Есть что проверить ещё"));

const resultText = computed(() =>
  isCorrect.value
    ? "Выделения пересекаются со всеми галлюцинированными фрагментами."
    : "Засчитываются только выделения, которые попадают в выдуманные фрагменты текста.",
);

const validateSelections = (): void => {
  if (!hasSelections.value) {
    return;
  }

  isSubmitted.value = true;
  emit("progress-change", {
    completed: isCorrect.value,
    score: score.value,
  });
};

const isRangeSelected = (range: TextRange): boolean =>
  selectedRanges.value.some((selectedRange) => rangesOverlap(selectedRange, range));

const isRangeHallucination = (range: TextRange): boolean =>
  isSubmitted.value &&
  hallucinationRanges.value.some((hallucinationRange) => rangesOverlap(hallucinationRange, range));

const textSegments = computed<readonly TextSegment[]>(() => {
  if (!content.value) {
    return [];
  }

  const visibleRanges = isSubmitted.value
    ? [...selectedRanges.value, ...hallucinationRanges.value]
    : selectedRanges.value;
  const boundaries = new Set<number>([0, content.value.text.length]);

  for (const range of visibleRanges) {
    boundaries.add(range.start);
    boundaries.add(range.end);
  }

  const sortedBoundaries = [...boundaries].sort((firstBoundary, secondBoundary) => firstBoundary - secondBoundary);

  return sortedBoundaries.slice(0, -1).map((start, index) => {
    const end = sortedBoundaries[index + 1] ?? start;
    const range = { start, end };

    return {
      id: `${start}-${end}`,
      text: content.value?.text.slice(start, end) ?? "",
      isSelected: isRangeSelected(range),
      isHallucination: isRangeHallucination(range),
    };
  });
});

const getSegmentClasses = (segment: TextSegment): string[] => {
  if (!isSubmitted.value && segment.isSelected) {
    return ["rounded bg-accent/30"];
  }

  if (segment.isHallucination && segment.isSelected) {
    return ["rounded bg-accent/40"];
  }

  if (segment.isHallucination) {
    return ["rounded bg-amber-200/70"];
  }

  if (segment.isSelected) {
    return ["rounded bg-red-100"];
  }

  return [];
};
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: найди галлюцинацию"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # найди галлюцинацию
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>
    <p class="mt-3 text-sm leading-6 text-stone-700">
      {{ content.instruction }}
    </p>

    <div
      ref="textContainer"
      class="mt-4 select-text rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm leading-7 text-stone-800"
    >
      <span
        v-for="segment in textSegments"
        :key="segment.id"
        :class="getSegmentClasses(segment)"
      >
        {{ segment.text }}
      </span>
    </div>

    <div class="mt-3 flex flex-wrap gap-2">
      <BaseButton size="sm" type="button" :disabled="isSubmitted" @click="addCurrentSelection">
        Добавить выделение
      </BaseButton>
      <BaseButton
        size="sm"
        variant="secondary"
        type="button"
        :disabled="!hasSelections"
        @click="clearSelections"
      >
        Очистить
      </BaseButton>
      <BaseButton
        size="sm"
        type="button"
        :disabled="!hasSelections || isSubmitted"
        @click="validateSelections"
      >
        Проверить
      </BaseButton>
    </div>

    <p class="mt-2 text-xs leading-5 text-stone-500">
      Выдели фрагмент мышкой или трекпадом, затем нажми «Добавить выделение».
      Можно добавить несколько фрагментов.
    </p>

    <div
      v-if="isSubmitted"
      class="mt-4 rounded-xl border px-4 py-3"
      :class="isCorrect ? 'border-accent bg-accent/20' : 'border-red-200 bg-red-50'"
      aria-live="polite"
    >
      <p class="text-sm font-bold text-stone-950">
        {{ resultTitle }} · {{ coveredHallucinationCount }}/{{ hallucinationRanges.length }}
      </p>
      <p class="mt-1 text-sm leading-6 text-stone-700">
        {{ resultText }}
      </p>
      <p v-if="isCorrect" class="mt-2 text-sm leading-6 text-stone-700">
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
      SpotTheHallucination упражнение не настроено.
    </p>
  </section>
</template>
