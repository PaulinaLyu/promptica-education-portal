<script setup lang="ts">
import type { Article } from "@entities/article";
import type { ArticleCompletionSummary } from "@entities/progress";
import { BaseBadge, BaseProgressBar, buildArticlePath } from "@shared";
import { computed } from "vue";

interface PropsArticleCard {
  readonly article: Article;
  readonly completionSummary?: ArticleCompletionSummary;
}

const props = defineProps<PropsArticleCard>();

const cardClasses = computed(() => [
  "group flex min-h-52 flex-col rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950",
  props.article.isFeatured
    ? "border-accent bg-accent text-stone-950"
    : "border-stone-200 bg-white text-stone-950 shadow-sm",
]);

const badgeClasses = computed(() => [
  "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
  props.article.isFeatured ? "bg-stone-950/10 text-stone-800" : "bg-stone-100 text-stone-600",
]);

const progressPercentage = computed(() => props.completionSummary?.percentage ?? 0);
</script>

<template>
  <RouterLink :to="buildArticlePath(article.id)" :class="cardClasses">
    <div class="flex items-start justify-between gap-4">
      <span :class="badgeClasses">{{ article.category }}</span>
      <BaseBadge
        v-if="completionSummary?.completed"
        variant="success"
        with-dot
      >
        завершено
      </BaseBadge>
      <span v-else class="text-lg text-stone-500 transition group-hover:translate-x-0.5">↗</span>
    </div>

    <span class="mt-8 text-4xl leading-none" aria-hidden="true">{{ article.symbol }}</span>

    <h3 class="mt-6 text-xl font-bold leading-tight">
      {{ article.title }}
    </h3>

    <p class="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
      {{ article.description }}
    </p>

    <BaseProgressBar
      class="mt-5"
      label="Прогресс"
      :value="progressPercentage"
      :variant="article.isFeatured ? 'contrast' : 'accent'"
    />

    <div class="mt-auto flex items-center gap-3 pt-6 text-xs text-stone-600">
      <span>{{ article.difficulty }}</span>
      <span aria-hidden="true">•</span>
      <span>{{ article.readingTimeMinutes }} мин</span>
    </div>
  </RouterLink>
</template>
