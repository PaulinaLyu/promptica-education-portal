<script setup lang="ts">
import { computed } from "vue";

type BaseButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type BaseButtonSize = "sm" | "md" | "lg";
type BaseButtonType = "button" | "submit" | "reset";

interface PropsBaseButton {
  readonly variant?: BaseButtonVariant;
  readonly size?: BaseButtonSize;
  readonly type?: BaseButtonType;
  readonly disabled?: boolean;
}

const props = withDefaults(defineProps<PropsBaseButton>(), {
  variant: "primary",
  size: "md",
  type: "button",
  disabled: false,
});

const variantClasses: Record<BaseButtonVariant, string> = {
  primary: "bg-stone-950 text-white hover:bg-stone-800 focus-visible:outline-stone-950",
  secondary: "border border-stone-200 bg-white text-stone-950 hover:bg-stone-50 focus-visible:outline-stone-300",
  ghost: "text-stone-700 hover:bg-stone-100 focus-visible:outline-stone-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
};

const sizeClasses: Record<BaseButtonSize, string> = {
  sm: "min-h-8 px-3 text-xs",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

const buttonClasses = computed(() => [
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variantClasses[props.variant],
  sizeClasses[props.size],
]);
</script>

<template>
  <button :class="buttonClasses" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
