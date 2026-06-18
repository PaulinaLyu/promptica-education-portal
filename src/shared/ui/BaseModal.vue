<script setup lang="ts">
interface PropsBaseModal {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<PropsBaseModal>(), {
  description: "",
  closeOnBackdrop: true,
});

const emit = defineEmits<{
  close: [];
}>();

const closeModal = (): void => {
  emit("close");
};

const closeFromBackdrop = (): void => {
  if (props.closeOnBackdrop) {
    closeModal();
  }
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 px-4 py-6"
      role="presentation"
      @click.self="closeFromBackdrop"
    >
      <section
        class="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 text-stone-950 shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${title}-modal-title`"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 :id="`${title}-modal-title`" class="text-xl font-bold">
              {{ title }}
            </h2>
            <p v-if="description" class="mt-2 text-sm leading-6 text-stone-600">
              {{ description }}
            </p>
          </div>

          <button
            class="inline-flex size-8 items-center justify-center rounded-full text-xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
            type="button"
            aria-label="Закрыть окно"
            @click="closeModal"
          >
            ×
          </button>
        </div>

        <div class="mt-6">
          <slot />
        </div>

        <div v-if="$slots.footer" class="mt-6 flex justify-end gap-3">
          <slot name="footer" />
        </div>
      </section>
    </div>
  </Teleport>
</template>
