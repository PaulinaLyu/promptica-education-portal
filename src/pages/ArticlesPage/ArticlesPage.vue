<script setup lang="ts">
import { ClearProgressButton } from "@features/progress";
import { BaseBadge, buildArticlePath } from "@shared";
import { ArticleGrid } from "@widgets";
import { useArticlesPage } from "./model/useArticlesPage";

const { articles, articleCount, completionSummaries, resetProgress } =
  useArticlesPage();
</script>

<template>
  <div class="w-full">
    <section class="max-w-3xl pt-8 sm:pt-12">
      <BaseBadge variant="muted" size="sm" with-dot
        >интерактивный курс</BaseBadge
      >

      <h1
        class="mt-8 max-w-2xl text-5xl font-bold leading-none tracking-tight text-stone-950 sm:text-6xl"
      >
        Учись писать промпты
        <span class="bg-accent px-2">не по теории</span>, а руками.
      </h1>

      <p class="mt-6 max-w-xl text-base leading-7 text-stone-600">
        Каждая статья — это короткое чтение и сразу упражнение. Никаких часовых
        лекций. Прочитал абзац — сразу попробовал.
      </p>

      <div class="mt-7 flex flex-col gap-3 sm:flex-row">
        <RouterLink
          class="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          :to="buildArticlePath('article-1')"
        >
          Начать с первой статьи →
        </RouterLink>

        <a
          class="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-950 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-300"
          href="#about"
        >
          Как это работает
        </a>
      </div>
    </section>

    <section class="mt-14" aria-labelledby="articles-title">
      <div
        class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <h2
          id="articles-title"
          class="text-3xl font-bold tracking-tight text-stone-950"
        >
          Статьи
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <p class="text-sm text-stone-500">{{ articleCount }} в подборке</p>
          <ClearProgressButton @cleared="resetProgress" />
        </div>
      </div>

      <ArticleGrid
        :articles="articles"
        :completion-summaries="completionSummaries"
      />
    </section>

    <section
      id="about"
      class="mt-20 rounded-3xl border border-stone-200 bg-white px-8 py-9 shadow-sm sm:px-10"
      aria-labelledby="about-title"
    >
      <h2
        id="about-title"
        class="text-2xl font-bold tracking-tight text-stone-950"
      >
        Как устроены статьи
      </h2>

      <div class="mt-8 grid gap-8 md:grid-cols-3">
        <article>
          <p class="text-xs font-semibold text-stone-400">01</p>
          <h3 class="mt-3 text-lg font-bold text-stone-950">Читай</h3>
          <p class="mt-2 text-sm leading-6 text-stone-600">
            Короткие абзацы без воды. Только то, что нужно для следующего шага.
          </p>
        </article>

        <article>
          <p class="text-xs font-semibold text-stone-400">02</p>
          <h3 class="mt-3 text-lg font-bold text-stone-950">Делай</h3>
          <p class="mt-2 text-sm leading-6 text-stone-600">
            После каждой мысли — упражнение: выбор, симулятор, кейс, поиск
            ошибок.
          </p>
        </article>

        <article>
          <p class="text-xs font-semibold text-stone-400">03</p>
          <h3 class="mt-3 text-lg font-bold text-stone-950">
            <span class="bg-accent p-2">Применяй</span>
          </h3>
          <p class="mt-2 text-sm leading-6 text-stone-600">
            Все примеры — настоящие задачи, которые встречаются в работе.
          </p>
        </article>
      </div>
    </section>
  </div>
</template>
