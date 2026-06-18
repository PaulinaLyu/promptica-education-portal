<script setup lang="ts">
import { computed } from "vue";

interface PropsBaseTextarea {
  readonly id: string;
  readonly label?: string;
  readonly hint?: string;
  readonly error?: string;
  readonly placeholder?: string;
  readonly rows?: number;
  readonly disabled?: boolean;
}

const props = withDefaults(defineProps<PropsBaseTextarea>(), {
  label: "",
  hint: "",
  error: "",
  placeholder: "",
  rows: 4,
  disabled: false,
});

const model = defineModel<string>({ default: "" });

const textareaClasses = computed(() => [
  "w-full resize-y rounded-2xl border bg-white px-4 py-3 text-sm leading-6 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-950 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500",
  props.error ? "border-red-300 focus:border-red-500" : "border-stone-200",
]);
</script>

<template>
  <label class="block" :for="id">
    <span v-if="label" class="mb-2 block text-sm font-semibold text-stone-900">
      {{ label }}
    </span>

    <textarea
      :id="id"
      v-model="model"
      :class="textareaClasses"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :aria-describedby="hint || error ? `${id}-message` : undefined"
    />
  </label>

  <p v-if="error || hint" :id="`${id}-message`" :class="['mt-2 text-xs', error ? 'text-red-600' : 'text-stone-500']">
    {{ error || hint }}
  </p>
</template>
