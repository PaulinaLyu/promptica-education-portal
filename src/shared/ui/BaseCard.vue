<script setup lang="ts">
import { computed } from "vue";

type BaseCardVariant = "default" | "accent" | "dark";
type BaseCardPadding = "sm" | "md" | "lg";

interface PropsBaseCard {
  readonly variant?: BaseCardVariant;
  readonly padding?: BaseCardPadding;
}

const props = withDefaults(defineProps<PropsBaseCard>(), {
  variant: "default",
  padding: "md",
});

const variantClasses: Record<BaseCardVariant, string> = {
  default: "border-stone-200 bg-white text-stone-950 shadow-sm",
  accent: "border-accent bg-accent text-stone-950",
  dark: "border-stone-950 bg-stone-950 text-white",
};

const paddingClasses: Record<BaseCardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const cardClasses = computed(() => [
  "rounded-3xl border",
  variantClasses[props.variant],
  paddingClasses[props.padding],
]);
</script>

<template>
  <section :class="cardClasses">
    <div v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </div>

    <slot />

    <div v-if="$slots.footer" class="mt-6">
      <slot name="footer" />
    </div>
  </section>
</template>
