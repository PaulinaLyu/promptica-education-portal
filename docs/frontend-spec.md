# Educational Portal Frontend Specification

## Overview

Build a frontend-only educational portal using Vue 3, TypeScript and Vite.

The application contains:

- Articles catalog page
- Article pages
- Interactive exercises embedded inside article content
- Progress tracking
- Exercise validation
- Prompt engineering learning mechanics

The architecture must be extensible and support adding new exercise types without modifying existing article rendering logic.

The project should be implemented as a content-driven application where articles are composed from structured blocks rather than hardcoded page layouts.

The initial version is frontend-only. Backend integration is not required, but the architecture must include abstraction layers that allow backend integration in future versions.

---

# Important Development Workflow

Before generating any code:

1. Read this specification completely.
2. Analyze all PNG files located in the design folder.
3. Identify reusable UI components.
4. Build page hierarchy.
5. Build content hierarchy.
6. Propose implementation plan.
7. Only after that begin coding.

Never start implementation before analyzing design assets.

---

# Design Assets

## Source of Truth

The UI design is provided as PNG exports from Figma.

Example structure:

```text
project/

├── docs/
│   └── frontend-spec.md
│
├── design/
│   ├── articles-page.png
│   ├── article-1.png
│   ├── article-2.png
│   └── article-3.png
│
└── src/
```

PNG files are the primary source of truth for:

- page structure
- layout
- spacing
- component hierarchy
- visual grouping
- content ordering
- article content
- exercise content

Do not redesign screens unless explicitly requested.

---

# Content Source

Article content must be extracted manually from the provided PNG designs.

Requirements:

- Do not generate article content automatically.
- Do not invent article content.
- Text, headings, examples, exercises and structure must be recreated from the PNG files.
- Convert extracted content into structured article JSON.
- Articles must be rendered from structured data, not static Vue templates.

---

# Language Requirements

The language of the application must match the language used in the provided PNG designs.

Requirements:

- UI labels must use the language from the design.
- Article content must use the language from the design.
- Exercise content must use the language from the design.
- Do not translate content unless explicitly requested.

---

# Design Implementation Rules

When implementing UI:

1. Analyze the corresponding PNG before coding.
2. Match layout structure as closely as possible.
3. Preserve:
   - spacing
   - visual hierarchy
   - grouping
   - content ordering
   - section structure

4. Use responsive adaptations only when necessary.
5. Do not invent new sections.
6. Do not remove existing sections.
7. If a design element is ambiguous:
   - implement a reusable solution
   - document assumptions in comments.

---

# Page Mapping

## Articles Catalog

Reference:

```text
design/articles-page.png
```

Route:

```text
/
```

---

## Article 1

Reference:

```text
design/article-1.png
```

Route:

```text
/articles/article-1
```

---

## Article 2

Reference:

```text
design/article-2.png
```

Route:

```text
/articles/article-2
```

---

## Article 3

Reference:

```text
design/article-3.png
```

Route:

```text
/articles/article-3
```

---

# Technology Stack

## Core

Required:

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- TanStack Query
- VueUse

---

## Styling

Required:

- Tailwind CSS

Optional:

- CSS Modules

---

## UI Components

Recommended:

- shadcn-vue
- Lucide Icons

Notes:

- Do not strictly follow Radix Vue patterns.
- Use native Vue components where simpler.
- Use Radix Vue only where it provides significant value.

Examples suitable for native implementation:

- buttons
- cards
- badges
- alerts
- form controls

Examples where libraries may help:

- dialogs
- tooltips
- popovers
- dropdowns

---

## Interactions

Required:

- Vue Draggable Plus
- Floating UI

Optional:

- mark.js
- text-highlighter

---

# Frontend Architecture Rules

1. Use Vue 3 Composition API with `<script setup lang="ts">` exclusively.
2. The Options API is strictly prohibited.
3. All code must be written in TypeScript.
4. Explicit and implicit `any` types are prohibited.
5. Every exercise implementation must conform to the shared `ExerciseDefinition` interface.
6. Exercise-specific state must remain local to the exercise component.
7. Pinia must be used only for shared/global application state.
8. Styling must be implemented using Tailwind CSS (preferred) or CSS Modules.
9. Direct DOM access and manipulation are prohibited except where required for the `SpotTheHallucination` exercise.
10. New exercise types must be integrated through the centralized `exerciseRegistry`.
11. Adding a new exercise type must not require modifications to the article renderer.
12. Components must be reusable, strongly typed, and follow the single-responsibility principle.
13. Business logic must not be placed inside Vue templates.
14. Avoid code duplication; extract reusable components and composables where appropriate.

---

# Application Pages

## Articles Catalog Page

Route:

```text
/
```

Features:

- Responsive grid
- Article cards
- Completion indicator
- Reading time
- Difficulty label

Interactions:

- Open article

---

## Article Page

Route:

```text
/articles/:id
```

Features:

- Article title
- Structured content rendering
- Embedded exercises
- Progress tracking
- Validation feedback

---

## Article Not Found Page

Route:

```text
/articles/:id
```

Behavior:

If the article does not exist:

- Show dedicated 404 page
- Show user-friendly message
- Provide navigation back to article catalog

Required component:

```text
ArticleNotFound
```

---

# Error Handling

Create reusable error state component.

Required component:

```text
ErrorState
```

Features:

- title
- description
- retry action

---

# Content Architecture

## Core Principle

Articles must NOT be implemented as static Vue pages.

Articles must be rendered from structured content.

---

# Article Model

```ts
interface Article {
  id: string;
  title: string;
  description?: string;
  blocks: ArticleBlock[];
}
```

---

# Article Blocks

```ts
type ArticleBlock = TextBlock | ImageBlock | ExerciseBlock;
```

---

## TextBlock

```ts
interface TextBlock {
  type: "text";
  content: string;
}
```

---

## ImageBlock

```ts
interface ImageBlock {
  type: "image";
  url: string;
  caption?: string;
}
```

---

## ExerciseBlock

```ts
interface ExerciseBlock {
  type: "exercise";
  exerciseId: string;
}
```

---

# Article Content Extraction

Article content visible in PNG files must be converted into structured JSON or ts module.

Example:

```ts
{
  id: "article-1",
  title: "Prompt Engineering",
  blocks: [
    {
      type: "text",
      content: "Introduction..."
    },
    {
      type: "exercise",
      exerciseId: "exercise-1"
    }
  ]
}
```

No article-specific hardcoded Vue templates.

---

# Article Renderer

Create:

```text
ArticleRenderer
```

Responsibilities:

- Iterate through blocks
- Render corresponding block component
- Resolve exercises

Pseudo logic:

```vue
<component :is="resolvedComponent" />
```

---

# Exercise System

## Core Requirement

All exercises must use a plugin architecture.

Adding a new exercise type must require only:

1. New component
2. Registry registration

No renderer modification.

---

# Exercise Base Types

```ts
interface ExerciseDefinition {
  id: string;
  type: ExerciseType;
  title: string;
}
```

---

# Exercise Registry

```ts
const exerciseRegistry = {
  multipleChoice,
  matchPairs,
  fillBlank,
  trueFalse,
  orderSteps,
  caseStudy,
  promptSimulator,
  spotTheHallucination,
  promptBuilder,
};
```

---

# Exercise Renderer

Responsibilities:

- Resolve exercise type
- Render corresponding component
- Handle validation state

---

# Exercise Types

## MultipleChoice

### Features

- Single answer
- Multiple answers
- Validation
- Explanation
- Partial scoring

### Model

```ts
{
  type: "multipleChoice",
  question: string,
  options: string[],
  correctAnswers: string[],
  multiSelect: boolean
}
```

### Validation

Must support partial scoring in version 1.

Example:

```text
Correct:
A B C

Selected:
A B

Result:
66%
```

Rules:

- Award partial credit for correct selections.
- Deduct score for incorrect selections if appropriate.
- Normalize score to 0–100.

---

## MatchPairs

### Features

- Match terms and definitions
- Drag and drop

### Library

Use:

```text
Vue Draggable Plus
```

### Model

```ts
{
  type: "matchPairs",
  pairs: {
      left: string,
      right: string
  }[]
}
```

### Validation

Compare selected connections against correct pairs.

---

## FillTheBlank

### Features

- Inline text inputs
- Multiple blanks

### Model

```ts
{
  type: "fillBlank",
  template: string,
  answers: Record<string,string>
}
```

Example:

```text
Prompt consists of {{1}} and {{2}}
```

### Validation

- Trim whitespace
- Ignore case

---

## TrueFalse

### Features

- True selection
- False selection
- Explanation display

### Model

```ts
{
  type: "trueFalse",
  statement: string,
  correct: boolean,
  explanation: string
}
```

---

## OrderSteps

### Features

- Drag and drop ordering

### Library

Use:

```text
Vue Draggable Plus
```

### Model

```ts
{
  type: "orderSteps",
  items: string[]
}
```

### Validation

Compare order indexes.

---

## CaseStudy

### Goal

Improve a weak prompt.

### Model

```ts
{
  type: "caseStudy",
  originalPrompt: string,
  rubric: {
      role: boolean,
      context: boolean,
      task: boolean,
      format: boolean
  }
}
```

### Interaction

User writes improved prompt.

### Validation

Rule-based scoring.

Evaluate:

- role
- context
- task
- output format

### Result

```ts
{
  score: number,
  feedback: string[]
}
```

---

## PromptSimulator

### Goal

Show simulated AI behavior.

No real AI requests.

### Model

```ts
{
  type: "promptSimulator",
  scenarioId: string
}
```

Scenario:

```ts
{
  weakPromptPatterns: string[],
  mediumPromptPatterns: string[],
  strongPromptPatterns: string[],

  weakResponse: string,
  mediumResponse: string,
  strongResponse: string
}
```

### Interaction

User enters prompt.

System determines quality level.

Displays corresponding response.

---

## SpotTheHallucination

### Goal

Find hallucinated fragments.

### Model

```ts
{
  type: "spotTheHallucination",
  text: string,
  hallucinations: TextRange[]
}
```

### TextRange

```ts
{
  start: number,
  end: number
}
```

### Interaction

User highlights text.

Support:

- multiple selections
- visual highlighting

### Validation

Range overlap comparison.

### Special Rule

Direct DOM interaction is allowed only inside this exercise.

---

## PromptBuilder

### Goal

Construct prompt from predefined blocks.

### Model

```ts
{
  type: "promptBuilder",
  sections: {
      roles: string[],
      contexts: string[],
      tasks: string[],
      formats: string[]
  }
}
```

### Features

- Select blocks
- Live preview
- Copy result

Generated prompt updates instantly.

---

# Backend Independence

The application is frontend-only.

Requirements:

- Do not implement a backend.
- Do not implement API calls.
- Create abstraction layers for future backend integration.

Example:

```ts
interface ArticleRepository {
  getArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article>;
}
```

```ts
interface ProgressRepository {
  saveProgress(progress: Progress): Promise<void>;
  loadProgress(): Promise<Progress>;
}
```

---

# Progress Tracking

## Completion Logic

An article is considered completed only when all exercises in the article are completed successfully, all 100%.

Example:

```text
5 exercises
4 completed

Completion = 80%
Article Completed = false
```

---

## Persistence

Progress must be stored in localStorage.

Persist:

- exercise completion
- exercise score
- article completion
- progress percentage

Progress must survive page reloads.

---

## Storage Abstraction

Do not access localStorage directly from exercise components.

Use abstraction:

```ts
interface ProgressStorage {
  load(): ProgressData;
  save(data: ProgressData): void;
  clear(): void;
}
```

---

## Progress Model

```ts
{
  articleId: {
      exerciseId: {
          completed: true,
          score: number
      }
  }
}
```

---

## Clear Progress

Provide a button allowing the user to remove all progress.

Required component:

```text
ClearProgressButton
```

Behavior:

- Remove all progress from localStorage
- Reset article completion
- Reset exercise completion
- Reset scores
- Require confirmation before deletion

---

# Pinia Stores

## articleStore

Responsibilities:

- article list
- current article

---

## exerciseStore

Responsibilities:

- validation state
- exercise results

---

## progressStore

Responsibilities:

- article completion
- exercise scores
- global progress indicators

---

# Shared UI Components

Create reusable UI primitives.

Required:

```text
BaseButton
BaseCard
BaseInput
BaseTextarea
BaseCheckbox
BaseRadio
BaseModal
BaseTooltip
BaseBadge
BaseProgressBar
BaseAlert
```

---

# Domain Components

Required:

```text
ArticleCard
ArticleHeader
ArticleRenderer

ExerciseCard
ExerciseHeader
ExerciseFooter

ValidationResult

ProgressIndicator

PromptPreview
PromptEditor

HallucinationHighlighter

ArticleNotFound
ErrorState

ClearProgressButton
```

---

# Exercise Layout Standard

All exercises should follow the same visual structure.

```text
Question

Content Area

Actions

Validation Result

Explanation
```

Consistency across all exercise types is mandatory.

---

# Responsiveness

Support:

```text
Mobile
Tablet
Desktop
```

Minimum width:

```text
320px
```

Layout behavior should follow PNG designs as closely as possible.

---

# Folder Structure

```text
src/

app/
  router/
  providers/

pages/
  ArticlesPage/
  ArticlePage/
  NotFoundPage/

widgets/
  ArticleGrid/
  ArticleRenderer/

entities/
  article/
  exercise/
  progress/

features/
  validateExercise/
  saveProgress/
  restoreProgress/
  clearProgress/

exercise-types/
  MultipleChoice/
  MatchPairs/
  FillTheBlank/
  TrueFalse/
  OrderSteps/
  CaseStudy/
  PromptSimulator/
  SpotTheHallucination/
  PromptBuilder/

shared/
  ui/
  composables/
  utils/
  constants/
  types/
  storage/
  repositories/
```

---

# Code Quality Requirements

Mandatory:

- Composition API only
- TypeScript only
- No any
- Reusable components
- Typed props
- Typed emits
- Separation of concerns

Avoid:

- business logic inside templates
- duplicated code
- article-specific rendering logic

---

# Acceptance Criteria

The implementation is considered complete when:

1. Articles catalog page matches design PNG.
2. All article pages match design PNGs.
3. Articles render from structured content.
4. All exercise types are functional.
5. Progress persists after refresh.
6. New exercise types can be added through registry registration only.
7. No article content is hardcoded into Vue page templates.
8. Application works on mobile, tablet and desktop.
9. TypeScript strict mode passes.
10. No usage of any.
11. All reusable components are extracted.
12. Exercise system remains extensible.
13. UI follows design assets with high layout fidelity.
14. Unknown article routes display a dedicated 404 page.
15. MultipleChoice supports partial scoring.
16. MatchPairs and OrderSteps use Vue Draggable Plus.
17. User can clear all saved progress.
18. Article content is recreated from PNG designs.
19. Backend integration points are abstracted through repository interfaces.
20. Article completion is based on completion of all exercises.

---

End of specification.
