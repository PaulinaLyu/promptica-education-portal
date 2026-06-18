<script setup lang="ts">
import { computed } from "vue";

type BaseAlertVariant = "info" | "success" | "warning" | "danger";

interface PropsBaseAlert {
  readonly variant?: BaseAlertVariant;
  readonly title?: string;
}

const props = withDefaults(defineProps<PropsBaseAlert>(), {
  variant: "info",
  title: "",
});

const variantClasses: Record<BaseAlertVariant, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  danger: "border-red-200 bg-red-50 text-red-950",
};

const alertClasses = computed(() => [
  "rounded-2xl border px-4 py-3 text-sm leading-6",
  variantClasses[props.variant],
]);
</script>

<template>
  <div :class="alertClasses" role="status">
    <p v-if="title" class="font-semibold">
      {{ title }}
    </p>
    <div :class="{ 'mt-1': title }">
      <slot />
    </div>
  </div>
</template>
