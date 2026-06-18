<script setup lang="ts">
import type { ArticleBlock } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { ExerciseRenderer } from "@features/exercise";

interface PropsArticleContent {
  readonly blocks: readonly ArticleBlock[];
}

defineProps<PropsArticleContent>();
const emit = defineEmits<{
  "exercise-progress-change": [exerciseId: string, progress: ExerciseProgress];
}>();

const emitExerciseProgressChange = (exerciseId: string, progress: ExerciseProgress): void => {
  emit("exercise-progress-change", exerciseId, progress);
};
</script>

<template>
  <div class="mt-10 space-y-8">
    <template v-for="block in blocks" :key="block.id">
      <p
        v-if="block.type === 'text'"
        class="max-w-2xl text-base leading-7 text-stone-600"
      >
        {{ block.text }}
      </p>

      <h2
        v-else-if="block.type === 'heading' && block.level === 2"
        class="max-w-2xl pt-4 text-2xl font-bold tracking-tight text-stone-950"
      >
        {{ block.text }}
      </h2>

      <h3
        v-else-if="block.type === 'heading'"
        class="max-w-2xl pt-3 text-xl font-bold tracking-tight text-stone-950"
      >
        {{ block.text }}
      </h3>

      <figure v-else-if="block.type === 'image'" class="overflow-hidden rounded-3xl">
        <img
          class="w-full object-cover"
          :src="block.src"
          :alt="block.alt"
          loading="lazy"
        />
        <figcaption
          v-if="block.caption"
          class="mt-3 text-sm leading-6 text-stone-500"
        >
          {{ block.caption }}
        </figcaption>
      </figure>

      <ExerciseRenderer
        v-else
        :block="block"
        @progress-change="emitExerciseProgressChange"
      />
    </template>
  </div>
</template>
