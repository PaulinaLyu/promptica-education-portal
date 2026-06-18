<script setup lang="ts">
import type { ExerciseBlock } from "@entities/article";
import type { ExerciseProgress } from "@entities/progress";
import {
  CASE_STUDY_EXERCISE_TYPE,
  ExerciseRenderer,
  FILL_THE_BLANK_EXERCISE_TYPE,
  MATCH_PAIRS_EXERCISE_TYPE,
  MULTIPLE_CHOICE_EXERCISE_TYPE,
  ORDER_STEPS_EXERCISE_TYPE,
  PROMPT_BUILDER_EXERCISE_TYPE,
  PROMPT_SIMULATOR_EXERCISE_TYPE,
  RISK_CLASSIFICATION_EXERCISE_TYPE,
  SPOT_THE_HALLUCINATION_EXERCISE_TYPE,
  TRUE_FALSE_EXERCISE_TYPE,
} from "@features/exercise";
import { BaseBadge, BaseCard, BaseProgressBar } from "@shared";
import { computed, ref } from "vue";

const exerciseExamples: readonly ExerciseBlock[] = [
  {
    id: "playground-risk-classification",
    type: "exercise",
    exerciseType: RISK_CLASSIFICATION_EXERCISE_TYPE,
    title: "Классифицируй риск",
    description:
      "Проверка выбора категории риска для нескольких рабочих сценариев.",
    riskClassification: {
      question: "Какой уровень риска у каждого сценария?",
      categories: [
        {
          id: "allowed",
          label: "Можно",
          description: "Нет персональных данных, секретов или внутренних материалов.",
        },
        {
          id: "sanitize",
          label: "Только после обезличивания",
          description: "Сначала нужно убрать чувствительные детали.",
        },
        {
          id: "blocked",
          label: "Нельзя отправлять",
          description: "Есть секреты, клиентские данные или закрытая информация.",
        },
      ],
      scenarios: [
        {
          id: "public-description",
          text: "Попросить AI сократить публичное описание функции с лендинга.",
          correctCategoryId: "allowed",
          feedback:
            "Публичный текст без приватного контекста можно отправлять в AI-сервис.",
        },
        {
          id: "client-message",
          text: "Отправить сообщение клиента с именем и email, чтобы сделать краткое резюме.",
          correctCategoryId: "sanitize",
          feedback:
            "Перед отправкой нужно заменить имя, email и другие идентификаторы.",
        },
        {
          id: "secret-token",
          text: "Вставить production-токен и попросить модель объяснить ошибку API.",
          correctCategoryId: "blocked",
          feedback:
            "Реальные секреты нельзя отправлять в чат. Используй плейсхолдер и проверь токен локально.",
        },
      ],
      explanation:
        "Классификация помогает быстро решить, можно ли отправлять данные как есть, нужно ли обезличивание или сценарий полностью запрещён.",
    },
  },
  {
    id: "playground-multiple-choice",
    type: "exercise",
    exerciseType: MULTIPLE_CHOICE_EXERCISE_TYPE,
    title: "Выбор ответа",
    description: "Проверь single-choice и частичный scoring для multiple-choice.",
    multipleChoice: {
      mode: "multiple",
      question: "Какие части делают промпт проверяемым?",
      options: [
        {
          id: "role",
          label: "Роль исполнителя",
        },
        {
          id: "format",
          label: "Формат ответа",
        },
        {
          id: "vague-quality",
          label: "Фраза «сделай красиво»",
        },
        {
          id: "constraint",
          label: "Ограничение по длине",
        },
      ],
      correctOptionIds: ["role", "format", "constraint"],
      explanation:
        "Роль, формат и ограничения снижают простор для догадок. Оценочное «красиво» не задаёт проверяемый критерий.",
    },
  },
  {
    id: "playground-match-pairs",
    type: "exercise",
    exerciseType: MATCH_PAIRS_EXERCISE_TYPE,
    title: "Сопоставь пары",
    description: "Проверка drag-and-drop сопоставления терминов и примеров.",
    matchPairs: {
      question: "Соедини часть промпта с её примером.",
      pairs: [
        {
          id: "role",
          prompt: "Роль",
          match: "Ты senior UX-writer",
        },
        {
          id: "context",
          prompt: "Контекст",
          match: "Текст для onboarding-экрана",
        },
        {
          id: "format",
          prompt: "Формат",
          match: "3 коротких варианта списком",
        },
      ],
      explanation:
        "Сопоставление помогает увидеть, что каждый блок промпта отвечает за отдельную часть результата.",
    },
  },
  {
    id: "playground-fill-blank",
    type: "exercise",
    exerciseType: FILL_THE_BLANK_EXERCISE_TYPE,
    title: "Вставь слово",
    description: "Проверка inline-input с несколькими допустимыми ответами.",
    fillTheBlank: {
      text: "Чтобы ответ было проще проверять, попроси модель вернуть данные в виде {{format}}.",
      blanks: [
        {
          id: "format",
          answers: ["таблицы", "таблица"],
          hint: "формат со строками и колонками",
        },
      ],
      explanation:
        "Таблица разделяет утверждения на строки и делает проверку каждого пункта проще.",
    },
  },
  {
    id: "playground-true-false",
    type: "exercise",
    exerciseType: TRUE_FALSE_EXERCISE_TYPE,
    title: "Верно или нет",
    description: "Проверка бинарного выбора с мгновенной обратной связью.",
    trueFalse: {
      statement:
        "Если попросить модель указать ограничения ответа, риск галлюцинаций обычно снижается.",
      correctAnswer: true,
      explanation:
        "Ограничения заставляют модель явно отделять уверенные утверждения от неизвестного или неподтверждённого.",
    },
  },
  {
    id: "playground-order-steps",
    type: "exercise",
    exerciseType: ORDER_STEPS_EXERCISE_TYPE,
    title: "Расставь шаги",
    description: "Проверка drag-and-drop порядка с кнопками вверх/вниз.",
    orderSteps: {
      question: "В каком порядке безопаснее улучшать слабый промпт?",
      steps: [
        {
          id: "goal",
          label: "Сформулировать цель результата",
        },
        {
          id: "audience",
          label: "Уточнить аудиторию и контекст",
        },
        {
          id: "task",
          label: "Задать конкретное действие",
        },
        {
          id: "format",
          label: "Зафиксировать формат ответа",
        },
      ],
      explanation:
        "Сначала нужна цель, затем контекст, после этого действие и только потом формат результата.",
    },
  },
  {
    id: "playground-case-study",
    type: "exercise",
    exerciseType: CASE_STUDY_EXERCISE_TYPE,
    title: "Кейс-стади",
    description: "Проверка многошагового выбора с фидбеком по каждому решению.",
    caseStudy: {
      scenario:
        "Команда запускает новую функцию и хочет быстро объяснить её новичкам без маркетингового шума.",
      weakPrompt: "Напиши нормальный текст про функцию.",
      goal:
        "Получить короткий onboarding-текст с понятной пользой и спокойным призывом к действию.",
      steps: [
        {
          id: "audience",
          title: "Уточнить аудиторию",
          question: "Какая правка лучше задаёт читателя?",
          correctOptionId: "new-users",
          options: [
            {
              id: "new-users",
              label: "Для новых пользователей, которые видят функцию впервые",
              feedback: "Да. Уровень объяснения сразу становится понятнее.",
            },
            {
              id: "everyone",
              label: "Для всех пользователей продукта",
              feedback: "Слишком широко: модель снова будет угадывать уровень подготовки.",
            },
          ],
        },
        {
          id: "format",
          title: "Зафиксировать формат",
          question: "Какое ограничение делает ответ проверяемым?",
          correctOptionId: "short-structure",
          options: [
            {
              id: "short-structure",
              label: "Заголовок, 2 предложения пользы и CTA до 4 слов",
              feedback: "Да. Формат задаёт структуру, длину и критерий готовности.",
            },
            {
              id: "nice-text",
              label: "Сделай красиво и профессионально",
              feedback: "Это оценка без конкретных критериев результата.",
            },
          ],
        },
      ],
      explanation:
        "Сильный промпт фиксирует аудиторию и формат, поэтому результат легче проверить и применить.",
    },
  },
  {
    id: "playground-prompt-simulator",
    type: "exercise",
    exerciseType: PROMPT_SIMULATOR_EXERCISE_TYPE,
    title: "Симулятор промпта",
    description: "Проверка rule-based симуляции без реальных AI-запросов.",
    promptSimulator: {
      scenario:
        "Нужно попросить модель написать короткое описание функции для новых пользователей.",
      placeholder:
        "Попробуй добавить слова: роль, новичков, формат, 2 предложения, CTA...",
      weak: {
        patterns: [],
        result: {
          title: "Ответ слишком общий",
          response:
            "Функция помогает пользователям быстрее достигать целей и улучшает опыт работы.",
          feedback:
            "В промпте не хватает аудитории, роли, ограничения или формата результата.",
        },
      },
      medium: {
        patterns: ["нович", "пользовател", "роль", "аудитор"],
        result: {
          title: "Контекст стал яснее",
          response:
            "Новая функция помогает новичкам быстрее понять следующий шаг в продукте.",
          feedback:
            "Аудитория уже задана, но формат результата ещё можно сделать жёстче.",
        },
      },
      strong: {
        patterns: ["формат", "2 предложения", "cta", "до 120"],
        result: {
          title: "Ответ управляемый",
          response:
            "Функция подсказывает следующий шаг прямо в интерфейсе, поэтому новичку проще продолжить. CTA: «Попробовать сейчас».",
          feedback:
            "Промпт задаёт аудиторию, действие и формат. Такой результат проще оценить.",
        },
      },
    },
  },
  {
    id: "playground-spot-hallucination",
    type: "exercise",
    exerciseType: SPOT_THE_HALLUCINATION_EXERCISE_TYPE,
    title: "Найди галлюцинацию",
    description: "Проверка Selection API и overlap-сравнения диапазонов.",
    spotTheHallucination: {
      instruction:
        "Выдели выдуманный фрагмент текста и нажми «Добавить выделение».",
      text: "В 2026 году Promptica получила официальную сертификацию NASA для обучения промптам в космических миссиях.",
      hallucinations: [
        {
          start: 31,
          end: 66,
        },
      ],
      explanation:
        "Официальная сертификация NASA выглядит как проверяемый факт, но в этом примере она выдумана.",
    },
  },
  {
    id: "playground-prompt-builder",
    type: "exercise",
    exerciseType: PROMPT_BUILDER_EXERCISE_TYPE,
    title: "Собери промпт",
    description: "Проверка выбора блоков и live preview итогового промпта.",
    promptBuilder: {
      intro:
        "Выбери по одному варианту в каждой категории: роль, контекст, задача и формат.",
      emptyPreviewText: "Выбери по одному варианту из каждой категории...",
      completedText:
        "Готово: промпт содержит исполнителя, ситуацию, действие и формат.",
      categories: [
        {
          id: "role",
          title: "Роль",
          options: [
            {
              id: "editor",
              label: "UX-редактор",
              promptText: "Ты UX-редактор.",
            },
            {
              id: "teacher",
              label: "Преподаватель",
              promptText: "Ты преподаватель.",
            },
          ],
        },
        {
          id: "context",
          title: "Контекст",
          options: [
            {
              id: "onboarding",
              label: "onboarding-экран",
              promptText: "Контекст: onboarding-экран для новых пользователей.",
            },
            {
              id: "newsletter",
              label: "email-рассылка",
              promptText: "Контекст: email-рассылка по продукту.",
            },
          ],
        },
        {
          id: "task",
          title: "Задача",
          options: [
            {
              id: "headline",
              label: "написать заголовок",
              promptText: "Задача: напиши заголовок.",
            },
            {
              id: "cta",
              label: "придумать CTA",
              promptText: "Задача: придумай CTA.",
            },
          ],
        },
        {
          id: "format",
          title: "Формат",
          options: [
            {
              id: "short",
              label: "до 60 знаков",
              promptText: "Формат: одна строка до 60 знаков.",
            },
            {
              id: "list",
              label: "списком",
              promptText: "Формат: ответ списком.",
            },
          ],
        },
      ],
    },
  },
];

const progressByExerciseId = ref<Record<string, ExerciseProgress>>({});

const completedCount = computed(
  () =>
    exerciseExamples.filter(
      (exerciseExample) => progressByExerciseId.value[exerciseExample.id]?.completed,
    ).length,
);

const progressPercentage = computed(() =>
  Math.round((completedCount.value / exerciseExamples.length) * 100),
);

const handleProgressChange = (exerciseId: string, progress: ExerciseProgress): void => {
  progressByExerciseId.value = {
    ...progressByExerciseId.value,
    [exerciseId]: progress,
  };
};

const getScoreLabel = (exerciseId: string): string => {
  const progress = progressByExerciseId.value[exerciseId];

  return progress ? `${Math.round(progress.score * 100)}%` : "не проверено";
};
</script>

<template>
  <div class="w-full space-y-8">
    <section class="max-w-3xl">
      <BaseBadge variant="muted" with-dot>exercise playground</BaseBadge>

      <h1 class="mt-6 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
        Примеры всех упражнений
      </h1>
      <p class="mt-4 max-w-2xl text-base leading-7 text-stone-600">
        Внутренняя страница для проверки всех зарегистрированных exercise types
        через общий `ExerciseRenderer`.
      </p>
    </section>

    <BaseCard padding="lg">
      <template #header>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-bold tracking-tight">Локальный прогресс</h2>
            <p class="mt-2 text-sm leading-6 text-stone-600">
              Не сохраняется в localStorage, нужен только для этой страницы.
            </p>
          </div>
          <BaseBadge variant="accent">
            {{ completedCount }} / {{ exerciseExamples.length }}
          </BaseBadge>
        </div>
      </template>

      <BaseProgressBar label="Пройдено примеров" :value="progressPercentage" />
    </BaseCard>

    <div class="space-y-6">
      <BaseCard
        v-for="exerciseExample in exerciseExamples"
        :key="exerciseExample.id"
        padding="lg"
      >
        <template #header>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <BaseBadge variant="neutral">
                {{ exerciseExample.exerciseType }}
              </BaseBadge>
              <h2 class="mt-3 text-2xl font-bold tracking-tight">
                {{ exerciseExample.title }}
              </h2>
            </div>

            <BaseBadge
              :variant="
                progressByExerciseId[exerciseExample.id]?.completed ? 'success' : 'muted'
              "
              with-dot
            >
              {{ getScoreLabel(exerciseExample.id) }}
            </BaseBadge>
          </div>
        </template>

        <ExerciseRenderer
          :block="exerciseExample"
          @progress-change="handleProgressChange"
        />
      </BaseCard>
    </div>
  </div>
</template>
