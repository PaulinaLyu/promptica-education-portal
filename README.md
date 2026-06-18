# Промптика — образовательный портал

Интерактивный курс по промпт-инжинирингу: короткие статьи с встроенными упражнениями. Читаешь абзац, закрепляешь понимание на практике.

https://promptica-education-portal.netlify.app/

## Что это

SPA на Vue 3. Контент — 5 статей с текстом, заголовками и 10 типами интерактивных упражнений. Прогресс по упражнениям сохраняется в `localStorage` и отображается на карточках статей и внутри статьи.

**Маршруты:**

| URL | Страница |
|-----|----------|
| `/` | Список статей |
| `/articles/:id` | Статья с упражнениями |
| `/exercise-playground` | Песочница всех типов упражнений |
| `/ui-playground` | Демо UI-компонентов |
| `/404` | Страница ошибки |

### Дизайн и документация

- **`design/`** — макеты экранов в PNG (`articles-page.png`, `article-1.png`, `article-2.png`). Референс для вёрстки главной и страниц статей.
- **`docs/`** — спеки для реализации:
  - `frontend-spec.md` — архитектура, типы упражнений, UI-компоненты, контракты прогресса и валидации
  - `implementation-plan.md` — поэтапный план разработки (фазы, deliverables, проверки)

---

## Стек и зачем он

- **Vue 3 + Composition API** — основа UI. Работаю в основном с React, хотелось попрактиковаться с Vue 3, года 4 назад работала с Vue2.
- **FSD** - также хотелось попрактиковать. 
- **Vue Router** — маршруты между списком статей, страницей статьи и playground-ами.
- **Tailwind CSS v4** — стили прямо в шаблонах, без отдельных CSS-файлов на каждый компонент.
- **vue-draggable-plus** — drag-and-drop в упражнениях «сопоставление пар» и «расставь по порядку».
- **localStorage** — сохранение прогресса по упражнениям без бэкенда.
- **Docker + nginx** — одинаковое окружение для локальной разработки и production-деплоя.

---

## Архитектура

Feature-Sliced Design:

```text
src/
├── app/           # layout, router
├── pages/         # ArticlesPage, ArticlePage, ExercisePlaygroundPage, UiPlaygroundPage
├── widgets/       # ArticleGrid, ArticleCard, ArticleContent
├── features/      # exercise (10 типов + registry), progress (сброс)
├── entities/      # article, progress (типы, репозитории, storage)
├── content/       # mockArticles.ts — контент статей
└── shared/        # UI-kit (Button, Badge, ProgressBar…), константы маршрутов
```

### 10 типов упражнений

| Тип | Компонент | Кратко |
|-----|-----------|--------|
| `multiple-choice` | MultipleChoiceExercise | Один или несколько вариантов |
| `true-false` | TrueFalseExercise | Верно / неверно |
| `match-pairs` | MatchPairsExercise | Drag-and-drop пар |
| `fill-the-blank` | FillTheBlankExercise | Пропуски `{{id}}` в тексте |
| `order-steps` | OrderStepsExercise | Drag-and-drop порядка шагов |
| `prompt-builder` | PromptBuilderExercise | Сборка промпта по категориям |
| `case-study` | CaseStudyExercise | Многошаговый кейс |
| `prompt-simulator` | PromptSimulatorExercise | Симулятор качества промпта |
| `spot-the-hallucination` | SpotTheHallucinationExercise | Выделение галлюцинаций в тексте |
| `risk-classification` | RiskClassificationExercise | Классификация сценариев по риску |

---

## Как работают проверки

Общий контракт: каждое упражнение эмитит `progress-change` с `{ completed: boolean, score: number }`.

- **`completed: true`** — упражнение засчитано как пройденное (влияет на прогресс-бар статьи).
- **`score`** — от 0 до 1, для частичных баллов.

| Упражнение | Логика проверки | `completed` | `score` |
|------------|-----------------|-------------|---------|
| **multiple-choice** | Точное совпадение набора с `correctOptionIds` | все верные, без лишних | `(верные − лишние) / всего_верных` |
| **true-false** | Сравнение с `correctAnswer` | совпало | 1 или 0 |
| **match-pairs** | Порядок `id` совпадает с эталоном | все пары верны | 1 или 0 |
| **fill-the-blank** | Каждый пропуск сравнивается с массивом `answers` (trim + lowercase) | все пропуски верны | 1 или 0 |
| **order-steps** | Порядок `id` шагов совпадает с эталоном | порядок верный | 1 или 0 |
| **prompt-builder** | Выбран вариант из каждой категории | все категории заполнены | 1 |
| **case-study** | На каждом шаге выбран `correctOptionId` | все шаги верны | 1 или 0 |
| **prompt-simulator** | Поиск паттернов в тексте промпта → weak / medium / strong | всегда после симуляции | 0.34 / 0.67 / 1 |
| **spot-the-hallucination** | Выделения пересекаются со всеми `hallucinations`, лишних нет | все найдены | покрытые / всего |
| **risk-classification** | Каждый сценарий сопоставлен с `correctCategoryId` | все верны | доля верных |

**Прогресс статьи** = доля упражнений с `completed: true` от общего числа exercise-блоков в статье (`calculateArticleCompletion`).

---

## Локальный запуск

### Вариант 1: npm

```bash
git clone <repo-url>
cd promptica-education-portal
npm install
npm run dev
```

Открыть: **http://localhost:5173**


### Вариант 2: Docker

Dev-сервер:

```bash
docker compose up --build
```

→ **http://localhost:5173**

Production через nginx:

```bash
docker compose --profile production up --build web
```

→ **http://localhost:8080**

---

## Как попробовать

### Основной сценарий — пройти курс

1. Открыть **http://localhost:5173**
2. Нажать **«Начать с первой статьи →»** или карточку **«Анатомия хорошего промпта»**
3. Пролистать текст, выполнить упражнения по ходу:
   - **Создай пары** — перетащить карточки, нажать «Проверить»
   - **Выбор ответа** — выбрать вариант(ы), «Проверить»
   - **Вставь слово** — заполнить пропуски
   - **Собери промпт** — выбрать по одному варианту в каждой категории
4. Смотреть **прогресс-бар** вверху статьи — растёт после каждого `completed: true`
5. Внизу — **«К следующей статье»** для перехода к article-2…article-5

**Статьи в подборке:**

| ID | Название |
|----|----------|
| article-1 | Анатомия хорошего промпта |
| article-2 | Галлюцинации AI: как ловить выдумку |
| article-3 | Спасаем плохие промпты |
| article-4 | Безопасность при работе с AI |
| article-5 | Токены и лимиты контекста в AI-моделях |

### Песочница упражнений

1. В шапке → **Exercises** (`/exercise-playground`)
2. Все 10 типов на одной странице с тестовыми данными
3. Удобно для проверки UI и логики без прохождения статей

### Сброс прогресса

Кнопка **«Сбросить прогресс»** на главной или внутри статьи — очищает `localStorage`, упражнения перерисовываются заново.

### UI Playground

Шапка → **UI Playground** — демо базовых компонентов (Button, Input, Modal, Badge и др.).

---

## Скрипты

```bash
npm run dev      # dev-сервер
npm run build    # typecheck + production-сборка в dist/
npm run preview  # preview production-сборки
```

---

## Структура контента

Статьи описаны в `src/content/articles/mockArticles.ts`. Блок упражнения:

```ts
{
  id: "article-1-exercise-1",
  type: "exercise",
  exerciseType: "multiple-choice",
  title: "Выбор ответа",
  description: "...",
  multipleChoice: { /* question, options, correctOptionIds, explanation */ }
}
```

Добавление нового типа: компонент в `features/exercise/ui/` + запись в `exerciseRegistry` + тип контента в `entities/article/model/types.ts`.
