<script setup lang="ts">
interface PropsErrorState {
  readonly title: string;
  readonly description: string;
  readonly eyebrow?: string;
  readonly actionLabel?: string;
  readonly actionTo?: string;
}

withDefaults(defineProps<PropsErrorState>(), {
  eyebrow: "Ошибка",
});

const emit = defineEmits<{
  action: [];
}>();

const handleAction = (): void => {
  emit("action");
};
</script>

<template>
  <section
    class="m-auto w-full max-w-3xl rounded-3xl border border-stone-200 bg-white px-8 py-10 text-center shadow-sm sm:px-10"
    aria-live="polite"
  >
    <p class="text-sm font-semibold uppercase tracking-[0.24em] text-400">
      {{ eyebrow }}
    </p>

    <h1 class="mt-4 text-4xl font-bold tracking-tight text-slate-950">
      {{ title }}
    </h1>

    <p class="mx-auto mt-4 max-w-xl text-base leading-7 text-stone-600">
      {{ description }}
    </p>

    <RouterLink
      v-if="actionTo && actionLabel"
      class="mt-7 inline-flex min-h-10 items-center justify-center rounded-full bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
      :to="actionTo"
    >
      {{ actionLabel }}
    </RouterLink>

    <button
      v-else-if="actionLabel"
      class="mt-7 inline-flex min-h-10 items-center justify-center rounded-full bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
      type="button"
      @click="handleAction"
    >
      {{ actionLabel }}
    </button>
  </section>
</template>
