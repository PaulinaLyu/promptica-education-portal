<script setup lang="ts">
import { computed } from "vue";

type BaseInputType = "email" | "number" | "password" | "search" | "tel" | "text" | "url";

interface PropsBaseInput {
  readonly id: string;
  readonly label?: string;
  readonly hint?: string;
  readonly error?: string;
  readonly placeholder?: string;
  readonly type?: BaseInputType;
  readonly disabled?: boolean;
}

const props = withDefaults(defineProps<PropsBaseInput>(), {
  label: "",
  hint: "",
  error: "",
  placeholder: "",
  type: "text",
  disabled: false,
});

const model = defineModel<string>({ default: "" });

const inputClasses = computed(() => [
  "min-h-10 w-full rounded-2xl border bg-white px-4 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-950 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500",
  props.error ? "border-red-300 focus:border-red-500" : "border-stone-200",
]);
</script>

<template>
  <label class="block" :for="id">
    <span v-if="label" class="mb-2 block text-sm font-semibold text-stone-900">
      {{ label }}
    </span>

    <input
      :id="id"
      v-model="model"
      :class="inputClasses"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :aria-describedby="hint || error ? `${id}-message` : undefined"
    />
  </label>

  <p v-if="error || hint" :id="`${id}-message`" :class="['mt-2 text-xs', error ? 'text-red-600' : 'text-stone-500']">
    {{ error || hint }}
  </p>
</template>
