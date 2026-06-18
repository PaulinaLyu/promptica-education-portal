<script setup lang="ts">
import { progressRepository } from "@entities/progress";
import { BaseButton, BaseModal } from "@shared";
import { ref } from "vue";

const emit = defineEmits<{
  cleared: [];
}>();

const isConfirmationOpen = ref(false);
const isClearing = ref(false);

const openConfirmation = (): void => {
  isConfirmationOpen.value = true;
};

const closeConfirmation = (): void => {
  if (!isClearing.value) {
    isConfirmationOpen.value = false;
  }
};

const clearProgress = async (): Promise<void> => {
  isClearing.value = true;
  await progressRepository.clearProgress();
  isClearing.value = false;
  isConfirmationOpen.value = false;
  emit("cleared");
};
</script>

<template>
  <BaseButton variant="secondary" size="sm" type="button" @click="openConfirmation">
    Сбросить прогресс
  </BaseButton>

  <BaseModal
    :open="isConfirmationOpen"
    title="Сбросить прогресс?"
    description="Все завершённые упражнения и проценты прохождения будут удалены с этого устройства."
    @close="closeConfirmation"
  >
    <p class="text-sm leading-6 text-stone-600">
      Действие нельзя отменить. После сброса статьи снова будут отображаться как
      непройденные.
    </p>

    <template #footer>
      <BaseButton
        variant="secondary"
        type="button"
        :disabled="isClearing"
        @click="closeConfirmation"
      >
        Отмена
      </BaseButton>
      <BaseButton
        variant="danger"
        type="button"
        :disabled="isClearing"
        @click="clearProgress"
      >
        {{ isClearing ? "Сбрасываем..." : "Сбросить" }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
