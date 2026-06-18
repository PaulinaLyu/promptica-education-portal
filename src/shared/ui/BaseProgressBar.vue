<script setup lang="ts">
import { computed } from "vue";

type BaseProgressBarVariant = "accent" | "contrast";

interface PropsBaseProgressBar {
  readonly value: number;
  readonly max?: number;
  readonly label?: string;
  readonly showValue?: boolean;
  readonly variant?: BaseProgressBarVariant;
}

const props = withDefaults(defineProps<PropsBaseProgressBar>(), {
  max: 100,
  label: "",
  showValue: true,
  variant: "accent",
});

const normalizedValue = computed(() => {
  if (props.max <= 0) {
    return 0;
  }

  return Math.min(Math.max(props.value, 0), props.max);
});

const progressPercentage = computed(() => Math.round((normalizedValue.value / props.max) * 100));
const labelClasses = computed(() =>
  props.variant === "contrast" ? "text-stone-950" : "text-stone-800",
);
const valueClasses = computed(() =>
  props.variant === "contrast" ? "text-stone-800" : "text-stone-600",
);
const trackClasses = computed(() =>
  props.variant === "contrast" ? "bg-stone-950/15" : "bg-stone-200",
);
const fillClasses = computed(() =>
  props.variant === "contrast" ? "bg-stone-950" : "bg-accent",
);
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="mb-2 flex items-center justify-between gap-3 text-sm">
      <span v-if="label" class="font-medium" :class="labelClasses">{{ label }}</span>
      <span v-if="showValue" class="tabular-nums" :class="valueClasses">{{ progressPercentage }}%</span>
    </div>

    <div class="h-2 overflow-hidden rounded-full" :class="trackClasses">
      <div
        class="h-full rounded-full transition-[width]"
        :class="fillClasses"
        :style="{ width: `${progressPercentage}%` }"
        role="progressbar"
        :aria-valuemin="0"
        :aria-valuemax="max"
        :aria-valuenow="normalizedValue"
      />
    </div>
  </div>
</template>
