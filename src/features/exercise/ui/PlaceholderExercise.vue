<script setup lang="ts">
import type { ExerciseBlock } from "@entities/article";

interface PropsPlaceholderExercise {
  readonly block: ExerciseBlock;
}

defineProps<PropsPlaceholderExercise>();
</script>

<template>
  <section
    class="rounded-3xl border border-dashed border-violet-300 bg-violet-50 px-6 py-5"
    aria-label="Упражнение"
  >
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
      Упражнение
    </p>
    <h2 class="mt-3 text-xl font-bold tracking-tight text-stone-950">
      {{ block.title }}
    </h2>
    <p class="mt-2 text-sm leading-6 text-stone-600">
      {{ block.description }}
    </p>
    <p class="mt-4 text-sm font-semibold text-violet-700">
      Интерактивная версия появится в следующей фазе.
    </p>
  </section>
</template>
