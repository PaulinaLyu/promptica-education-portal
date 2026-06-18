# Educational Portal Frontend — Implementation Plan

## Purpose

This document defines the implementation roadmap for the Educational Portal frontend.

The project must be developed incrementally. Each phase must produce a runnable application that can be started, tested, and reviewed independently.

Rules:

- Every phase must leave the application in a working state.
- Existing functionality must not be broken by later phases.
- All code must follow the rules defined in `frontend-spec.md`.
- Before starting a phase, review the design PNG files and existing implementation.
- Complete one phase at a time.

---

# Phase 1 — Project Bootstrap

## Goal

Create the initial project and development environment.

## Tasks

- Create Vue 3 application using Vite.
- Configure TypeScript.
- Configure Tailwind CSS.
- Install Vue Router.
- Install Pinia.
- Install TanStack Query.
- Create initial folder structure.
- Configure path aliases.

## Deliverables

```text
src/
app/
pages/
widgets/
entities/
features/
exercise-types/
shared/
```

## Verification

Application starts successfully.

```bash
npm run dev
```

Page displays:

```text
Educational Portal
Project Initialized
```

---

# Phase 2 — Application Shell

## Goal

Create the common application layout.

## Tasks

- Create AppLayout.
- Create Header.
- Create Footer.
- Create Main content container.
- Create responsive layout structure.

## Deliverables

- AppLayout component
- Header component
- Footer component

## Verification

Application displays consistent layout structure.

---

# Phase 3 — Routing Foundation

## Goal

Configure application routing.

## Tasks

Create routes:

```text
/
/articles/:id
/404
```

Add route fallback.

## Deliverables

- Router configuration
- Route constants

## Verification

Navigation works between pages.

---

# Phase 4 — UI Foundation

## Goal

Create reusable UI primitives.

## Tasks

Create:

```text
BaseButton
BaseCard
BaseInput
BaseTextarea
BaseCheckbox
BaseRadio
BaseBadge
BaseAlert
BaseModal
BaseProgressBar
```

## Deliverables

Reusable UI component library.

## Verification

Create a temporary playground page demonstrating all components.

---

# Phase 5 — Articles Catalog Mock

## Goal

Render article cards using static mock data.

## Tasks

- Create ArticleCard.
- Create ArticleGrid.
- Create mock article dataset.
- Render catalog page.

## Deliverables

Articles catalog page.

## Verification

Catalog displays article cards.

---

# Phase 6 — Repository Layer

## Goal

Introduce data abstraction.

## Tasks

Create:

```ts
ArticleRepository;
MockArticleRepository;
```

Move article retrieval into repository abstraction.

## Deliverables

Repository-based article loading.

## Verification

Catalog continues working through repository layer.

---

# Phase 7 — Article Page Skeleton

## Goal

Create article page infrastructure.

## Tasks

- Create ArticlePage.
- Load article by route id.
- Display article title.
- Add loading state.

## Deliverables

Article page.

## Verification

Article route opens correctly.

---

# Phase 8 — Error States & 404

## Goal

Handle invalid routes and unknown articles.

## Tasks

Create:

```text
ArticleNotFound
ErrorState
```

Handle missing article IDs.

## Deliverables

404 experience.

## Verification

```text
/articles/non-existent
```

Displays not-found page.

---

# Phase 9 — Content Engine

## Goal

Introduce block-based article rendering.

## Tasks

Implement:

```ts
TextBlock;
ImageBlock;
ExerciseBlock;
```

Create:

```text
ArticleRenderer
```

## Deliverables

Structured article rendering.

## Verification

Articles render from block data.

---

# Phase 10 — Exercise Infrastructure

## Goal

Build exercise architecture.

## Tasks

Create:

```ts
ExerciseDefinition;
```

Create:

```ts
exerciseRegistry;
```

Create:

```text
ExerciseRenderer
```

## Deliverables

Exercise plugin system.

## Verification

Exercise blocks render placeholder exercises.

---

# Phase 11 — MultipleChoice

## Goal

Implement first fully working exercise.

## Tasks

- Single choice mode.
- Multiple choice mode.
- Validation.
- Explanation display.
- Partial scoring support.

## Deliverables

MultipleChoice component.

## Verification

Exercise can be completed and scored.

---

# Phase 12 — Progress Infrastructure

## Goal

Create progress architecture.

## Tasks

Create:

```ts
ProgressStorage;
ProgressRepository;
```

Create progress domain models.

## Deliverables

Progress abstraction layer.

## Verification

Progress services compile and integrate.

---

# Phase 13 — Progress Persistence

## Goal

Persist user progress.

## Tasks

- Implement localStorage adapter.
- Save exercise completion.
- Restore progress after reload.
- Save exercise scores.

## Deliverables

Persistent progress.

## Verification

Refresh browser and progress remains.

---

# Phase 14 — MatchPairs

## Goal

Implement pair matching exercise.

## Tasks

- Install Vue Draggable Plus.
- Create MatchPairs component.
- Implement validation.

## Deliverables

Working MatchPairs exercise.

## Verification

Users can connect pairs and validate answers.

---

# Phase 15 — FillTheBlank

## Goal

Implement fill-in-the-blank exercise.

## Tasks

- Parse placeholders.
- Render inline inputs.
- Validate answers.

## Deliverables

Working FillTheBlank exercise.

## Verification

Answers can be entered and validated.

---

# Phase 16 — TrueFalse & OrderSteps

## Goal

Implement remaining core exercises.

## Tasks

Create:

```text
TrueFalse
OrderSteps
```

Use Vue Draggable Plus for ordering.

## Deliverables

Two new exercise types.

## Verification

Both exercises function correctly.

---

# Phase 17 — Article Completion

## Goal

Track article completion status.

## Tasks

- Calculate completion percentage.
- Determine completed articles.
- Display completion indicators.

Rule:

Article is completed only when all exercises are completed successfully.

## Deliverables

Completion tracking.

## Verification

Article status updates automatically.

---

# Phase 18 — PromptBuilder & CaseStudy

## Goal

Implement prompt engineering exercises.

## Tasks

Create:

```text
PromptBuilder
CaseStudy
```

## Deliverables

Prompt engineering learning tools.

## Verification

Both exercises are fully interactive.

---

# Phase 19 — PromptSimulator & SpotTheHallucination

## Goal

Implement advanced exercises.

## Tasks

Create:

```text
PromptSimulator
SpotTheHallucination
```

Use Selection API only inside SpotTheHallucination.

## Deliverables

Advanced interactive exercises.

## Verification

Prompt simulation and hallucination detection work correctly.

---

# Phase 20 — Final Integration & Polish

## Goal

Prepare MVP release.

## Tasks

- Extract article content from PNG designs.
- Convert content into structured JSON.
- Integrate all exercise types into real articles.
- Add responsive behavior.
- Add Clear Progress functionality.
- Review accessibility.
- Remove temporary code.
- Final refactoring.
- Final TypeScript validation.

## Deliverables

Production-ready frontend MVP.

## Verification Checklist

- Articles catalog matches design.
- Article pages match design.
- Articles render from structured content.
- All exercises work.
- Progress persists.
- Progress can be cleared.
- Completion logic works.
- 404 page works.
- Mobile layout works.
- Tablet layout works.
- Desktop layout works.
- TypeScript passes without errors.
- No `any` types exist.
- Exercise registry remains extensible.

---

# Cursor Execution Instructions

When implementing a phase:

1. Read `frontend-spec.md`.
2. Read this implementation plan.
3. Implement only the requested phase.
4. Do not modify unrelated functionality.
5. Keep the application runnable.
6. Ensure TypeScript passes.
7. Ensure linting passes.
8. Summarize completed work after implementation.

Example prompt:

```text
Implement Phase 11 from implementation-plan.md.

Requirements:
- Follow frontend-spec.md.
- Do not modify completed phases unnecessarily.
- Keep application runnable.
- Return a summary of changes.
```
