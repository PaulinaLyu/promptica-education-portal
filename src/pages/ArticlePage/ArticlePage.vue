<script setup lang="ts">
import { ArticleNotFound } from "@entities/article";
import { ClearProgressButton } from "@features/progress";
import {
  BaseBadge,
  BaseProgressBar,
  buildArticlePath,
  ROUTE_PATHS,
} from "@shared";
import { ArticleContent } from "@widgets";
import { toRef } from "vue";
import { useArticlePage } from "./model/useArticlePage";

interface PropsArticlePage {
  readonly articleId: string;
}

const props = defineProps<PropsArticlePage>();
const {
  article,
  isLoading,
  completionSummary,
  nextArticle,
  rendererKey,
  handleExerciseProgressChange,
  handleProgressCleared,
} = useArticlePage(toRef(props, "articleId"));
</script>

<template>
  <div class="w-full">
    <article
      v-if="isLoading"
      class="mx-auto w-full max-w-2xl py-10"
      aria-live="polite"
    >
      <p
        class="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600"
      >
        Загрузка
      </p>
      <h1 class="mt-4 text-4xl font-bold tracking-tight text-slate-950">
        Загружаем статью...
      </h1>
    </article>

    <article v-else-if="article" class="mx-auto w-full max-w-2xl">
      <RouterLink
        class="text-xs font-semibold text-stone-500 transition hover:text-stone-950"
        :to="ROUTE_PATHS.home"
      >
        ← ко всем статьям
      </RouterLink>

      <div class="mt-8 flex flex-wrap items-center gap-2">
        <BaseBadge variant="muted">{{ article.category }}</BaseBadge>
        <BaseBadge variant="muted">{{ article.difficulty }}</BaseBadge>
        <BaseBadge variant="muted"
          >{{ article.readingTimeMinutes }} мин</BaseBadge
        >
        <BaseBadge
          v-if="completionSummary?.completed"
          variant="success"
          with-dot
        >
          завершено
        </BaseBadge>
      </div>

      <span class="mt-7 block text-4xl leading-none" aria-hidden="true">
        {{ article.symbol }}
      </span>

      <h1 class="mt-5 text-4xl font-bold tracking-tight text-slate-950">
        {{ article.title }}
      </h1>

      <p class="mt-4 max-w-2xl text-base leading-7 text-stone-600">
        {{ article.description }}
      </p>

      <div v-if="completionSummary" class="mt-8">
        <BaseProgressBar
          label="Прогресс статьи"
          :value="completionSummary.percentage"
        />

        <div
          class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-sm text-stone-500">
            {{ completionSummary.completedExerciseCount }} из
            {{ completionSummary.totalExerciseCount }} упражнений завершено
          </p>
          <ClearProgressButton @cleared="handleProgressCleared" />
        </div>
      </div>

      <ArticleContent
        :key="rendererKey"
        :blocks="article.blocks"
        @exercise-progress-change="handleExerciseProgressChange"
      />

      <section class="mt-10 rounded-3xl bg-stone-950 px-6 py-6 text-white">
        <p class="text-xl font-bold">Дошёл до конца 🎯</p>
        <p class="mt-2 text-sm leading-6 text-stone-300">
          Возвращайся к следующим статьям — там новые упражнения.
        </p>

        <RouterLink
          class="mt-4 inline-flex min-h-10 items-center rounded-full bg-accent px-4 text-sm font-bold text-stone-950 transition hover:bg-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          :to="
            nextArticle ? buildArticlePath(nextArticle.id) : ROUTE_PATHS.home
          "
        >
          {{ nextArticle ? "К следующей статье" : "К списку статей" }}
        </RouterLink>
      </section>
    </article>

    <ArticleNotFound v-else />
  </div>
</template>
