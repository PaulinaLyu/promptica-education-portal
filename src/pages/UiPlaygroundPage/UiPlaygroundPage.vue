<script setup lang="ts">
import {
  BaseAlert,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseCheckbox,
  BaseInput,
  BaseModal,
  BaseProgressBar,
  BaseRadio,
  BaseTextarea,
} from "@shared";
import { computed, ref } from "vue";

const inputValue = ref("Промптика");
const textareaValue = ref("Сформулируй промпт с ролью, контекстом, задачей и форматом.");
const isCheckboxEnabled = ref(true);
const selectedTone = ref("friendly");
const isModalOpen = ref(false);

const previewPrompt = computed(() =>
  [
    "Ты редактор образовательного продукта.",
    textareaValue.value,
    `Тон: ${selectedTone.value === "friendly" ? "дружелюбный" : "нейтральный"}.`,
  ].join(" "),
);

const openModal = (): void => {
  isModalOpen.value = true;
};

const closeModal = (): void => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="w-full space-y-8">
    <section class="max-w-3xl">
      <BaseBadge variant="muted" with-dot>UI playground</BaseBadge>

      <h1 class="mt-6 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
        Компоненты интерфейса
      </h1>
      <p class="mt-4 max-w-2xl text-base leading-7 text-stone-600">
        Внутренняя страница для быстрой проверки базовых UI-примитивов и их
        состояний.
      </p>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard padding="lg">
        <template #header>
          <h2 class="text-2xl font-bold tracking-tight">Кнопки и бейджи</h2>
        </template>

        <div class="flex flex-wrap gap-3">
          <BaseButton>Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
          <BaseButton variant="danger">Danger</BaseButton>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
          <BaseBadge>neutral</BaseBadge>
          <BaseBadge variant="accent">accent</BaseBadge>
          <BaseBadge variant="success" with-dot>success</BaseBadge>
          <BaseBadge variant="warning">warning</BaseBadge>
          <BaseBadge variant="danger">danger</BaseBadge>
        </div>
      </BaseCard>

      <BaseCard padding="lg">
        <template #header>
          <h2 class="text-2xl font-bold tracking-tight">Прогресс и алерты</h2>
        </template>

        <div class="space-y-5">
          <BaseProgressBar label="Прогресс статьи" :value="66" />
          <BaseAlert variant="success" title="Готово">
            Упражнение завершено, прогресс сохранён.
          </BaseAlert>
          <BaseAlert variant="warning" title="Проверь">
            Ответ частично правильный: можно улучшить формулировку.
          </BaseAlert>
        </div>
      </BaseCard>

      <BaseCard padding="lg">
        <template #header>
          <h2 class="text-2xl font-bold tracking-tight">Формы</h2>
        </template>

        <div class="space-y-5">
          <BaseInput
            id="playground-title"
            v-model="inputValue"
            label="Название"
            hint="Пример короткого текстового поля."
            placeholder="Введите название"
          />

          <BaseTextarea
            id="playground-prompt"
            v-model="textareaValue"
            label="Промпт"
            hint="Textarea для длинного пользовательского ввода."
            placeholder="Введите промпт"
          />

          <BaseCheckbox
            id="playground-checkbox"
            v-model="isCheckboxEnabled"
            label="Показывать подсказки"
            hint="Пример checkbox-состояния."
          />

          <fieldset class="space-y-3">
            <legend class="text-sm font-bold text-stone-950">Тон ответа</legend>
            <BaseRadio
              id="tone-friendly"
              v-model="selectedTone"
              name="tone"
              value="friendly"
              label="Дружелюбный"
            />
            <BaseRadio
              id="tone-neutral"
              v-model="selectedTone"
              name="tone"
              value="neutral"
              label="Нейтральный"
            />
          </fieldset>
        </div>
      </BaseCard>

      <BaseCard variant="dark" padding="lg">
        <template #header>
          <h2 class="text-2xl font-bold tracking-tight">Preview</h2>
        </template>

        <p class="text-sm leading-6 text-stone-300">
          {{ previewPrompt }}
        </p>

        <template #footer>
          <BaseButton variant="secondary" type="button" @click="openModal">
            Открыть modal
          </BaseButton>
        </template>
      </BaseCard>
    </div>

    <BaseModal
      :open="isModalOpen"
      title="Пример модального окна"
      description="Проверка BaseModal на playground-странице."
      @close="closeModal"
    >
      <p class="text-sm leading-6 text-stone-600">
        Компонент открыт из `UiPlaygroundPage` и использует общий слот footer.
      </p>

      <template #footer>
        <BaseButton variant="secondary" type="button" @click="closeModal">
          Закрыть
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
