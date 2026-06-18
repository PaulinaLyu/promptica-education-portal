<script setup lang="ts">
interface PropsBaseRadio {
  readonly id: string;
  readonly name: string;
  readonly value: string;
  readonly label: string;
  readonly hint?: string;
  readonly disabled?: boolean;
}

withDefaults(defineProps<PropsBaseRadio>(), {
  hint: "",
  disabled: false,
});

const model = defineModel<string>({ default: "" });
</script>

<template>
  <label class="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3" :for="id">
    <input
      :id="id"
      v-model="model"
      class="mt-0.5 size-4 border-stone-300 text-stone-950 accent-accent focus:ring-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
      type="radio"
      :name="name"
      :value="value"
      :disabled="disabled"
    />

    <span>
      <span class="block text-sm font-semibold text-stone-900">{{ label }}</span>
      <span v-if="hint" class="mt-1 block text-xs leading-5 text-stone-500">{{ hint }}</span>
    </span>
  </label>
</template>
