<script setup lang="ts">
import type { ExerciseBlock, PromptBuilderCategory } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { computed, ref, watch } from "vue";

interface PropsPromptBuilderExercise {
  readonly block: ExerciseBlock;
}

const props = defineProps<PropsPromptBuilderExercise>();
const emit = defineEmits<{
  "progress-change": [progress: ExerciseProgress];
}>();

const selectedOptionByCategoryId = ref<Record<string, string>>({});
const hasCompleted = ref(false);

const content = computed(() => props.block.promptBuilder);

const resetBuilder = (): void => {
  selectedOptionByCategoryId.value = {};
  hasCompleted.value = false;
};

watch(content, resetBuilder, { immediate: true });

const selectedCategoryCount = computed(() =>
  content.value?.categories.filter((category) => Boolean(selectedOptionByCategoryId.value[category.id]))
    .length ?? 0,
);

const isComplete = computed(
  () =>
    Boolean(content.value?.categories.length) &&
    selectedCategoryCount.value === content.value?.categories.length,
);

const getSelectedOptionText = (category: PromptBuilderCategory): string => {
  const selectedOptionId = selectedOptionByCategoryId.value[category.id];
  const selectedOption = category.options.find((option) => option.id === selectedOptionId);

  return selectedOption?.promptText ?? "";
};

const promptPreview = computed(() => {
  if (!content.value || !isComplete.value) {
    return content.value?.emptyPreviewText ?? "";
  }

  return content.value.categories.map(getSelectedOptionText).join(" ");
});

const selectOption = (categoryId: string, optionId: string): void => {
  selectedOptionByCategoryId.value = {
    ...selectedOptionByCategoryId.value,
    [categoryId]: optionId,
  };

  if (!hasCompleted.value && isComplete.value) {
    hasCompleted.value = true;
    emit("progress-change", {
      completed: true,
      score: 1,
    });
  }
};

const isOptionSelected = (categoryId: string, optionId: string): boolean =>
  selectedOptionByCategoryId.value[categoryId] === optionId;

const getOptionClasses = (categoryId: string, optionId: string): string[] =>
  isOptionSelected(categoryId, optionId)
    ? ["border-stone-950 bg-stone-950 text-white shadow-sm"]
    : ["border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"];
</script>

<template>
  <section
    v-if="content"
    class="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
    aria-label="Упражнение: собери промпт"
  >
    <p
      class="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stone-950"
    >
      # собери промпт
    </p>

    <h2 class="mt-4 text-base font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>
    <p class="mt-3 text-sm leading-6 text-stone-700">
      {{ content.intro }}
    </p>

    <div class="mt-5 space-y-4">
      <fieldset v-for="category in content.categories" :key="category.id">
        <legend class="text-xs font-black uppercase tracking-[0.12em] text-stone-500">
          {{ category.title }}
        </legend>

        <div class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="option in category.options"
            :key="option.id"
            type="button"
            class="min-h-10 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            :class="getOptionClasses(category.id, option.id)"
            :aria-pressed="isOptionSelected(category.id, option.id)"
            @click="selectOption(category.id, option.id)"
          >
            {{ option.label }}
          </button>
        </div>
      </fieldset>
    </div>

    <div
      class="mt-5 rounded-2xl border border-dashed px-4 py-4"
      :class="isComplete ? 'border-accent bg-accent/20' : 'border-stone-200 bg-stone-50'"
      aria-live="polite"
    >
      <p class="text-xs font-black uppercase tracking-[0.12em] text-stone-500">
        Итоговый промпт
      </p>
      <p class="mt-2 text-sm font-semibold leading-6 text-stone-800">
        {{ promptPreview }}
      </p>
    </div>

    <p v-if="isComplete" class="mt-3 text-sm leading-6 text-stone-700">
      {{ content.completedText }}
    </p>
  </section>

  <section
    v-else
    class="rounded-2xl border border-red-200 bg-red-50 px-5 py-5"
    aria-label="Упражнение не настроено"
  >
    <p class="text-sm font-semibold text-red-800">
      PromptBuilder упражнение не настроено.
    </p>
  </section>
</template>
