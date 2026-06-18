<script setup lang="ts">
import { computed } from "vue";

type BaseBadgeVariant = "neutral" | "muted" | "accent" | "success" | "warning" | "danger";
type BaseBadgeSize = "sm" | "lg";

interface PropsBaseBadge {
  readonly variant?: BaseBadgeVariant;
  readonly size?: BaseBadgeSize;
  readonly withDot?: boolean;
}

const props = withDefaults(defineProps<PropsBaseBadge>(), {
  variant: "neutral",
  size: "sm",
  withDot: false,
});

const variantClasses: Record<BaseBadgeVariant, string> = {
  neutral: "bg-stone-100 text-stone-700",
  muted: "bg-stone-200/70 text-stone-950",
  accent: "bg-accent text-stone-950",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
};

const sizeClasses: Record<BaseBadgeSize, string> = {
  sm: "gap-1.5 px-2.5 py-1 text-xs font-semibold",
  lg: "gap-3 px-5 py-3 text-2xl font-bold leading-none",
};

const dotClasses: Record<BaseBadgeSize, string> = {
  sm: "size-1.5",
  lg: "size-3",
};

const badgeClasses = computed(() => [
  "inline-flex items-center rounded-full",
  variantClasses[props.variant],
  sizeClasses[props.size],
]);
</script>

<template>
  <span :class="badgeClasses">
    <span
      v-if="withDot"
      :class="['rounded-full bg-current', dotClasses[size]]"
      aria-hidden="true"
    />
    <slot />
  </span>
</template>
