<script setup lang="ts">
interface PropsBaseCheckbox {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly disabled?: boolean;
}

withDefaults(defineProps<PropsBaseCheckbox>(), {
  hint: "",
  disabled: false,
});

const model = defineModel<boolean>({ default: false });
</script>

<template>
  <label class="flex items-start gap-3" :for="id">
    <input
      :id="id"
      v-model="model"
      class="mt-0.5 size-4 rounded border-stone-300 text-stone-950 accent-accent focus:ring-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
      type="checkbox"
      :disabled="disabled"
    />

    <span>
      <span class="block text-sm font-semibold text-stone-900">{{ label }}</span>
      <span v-if="hint" class="mt-1 block text-xs leading-5 text-stone-500">{{ hint }}</span>
    </span>
  </label>
</template>
