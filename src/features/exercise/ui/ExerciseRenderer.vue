<script setup lang="ts">
import type { ExerciseBlock } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import { computed } from "vue";
import { getExerciseDefinition } from "../model/registry";
import PlaceholderExercise from "./PlaceholderExercise.vue";

interface PropsExerciseRenderer {
  readonly block: ExerciseBlock;
}

const props = defineProps<PropsExerciseRenderer>();
const emit = defineEmits<{
  "progress-change": [exerciseId: string, progress: ExerciseProgress];
}>();

const exerciseComponent = computed(
  () => getExerciseDefinition(props.block.exerciseType)?.component ?? PlaceholderExercise,
);

const emitProgressChange = (progress: ExerciseProgress): void => {
  emit("progress-change", props.block.id, progress);
};
</script>

<template>
  <component
    :is="exerciseComponent"
    :block="block"
    @progress-change="emitProgressChange"
  />
</template>
