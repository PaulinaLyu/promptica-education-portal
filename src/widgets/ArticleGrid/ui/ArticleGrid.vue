<script setup lang="ts">
import type { Article } from "@entities/article";
import type { ArticleCompletionSummary } from "@entities/progress";
import { ArticleCard } from "@widgets";

interface PropsArticleGrid {
  readonly articles: readonly Article[];
  readonly completionSummaries?: Readonly<Record<string, ArticleCompletionSummary>>;
}

defineProps<PropsArticleGrid>();
</script>

<template>
  <div class="grid gap-5 md:grid-cols-3">
    <ArticleCard
      v-for="article in articles"
      :key="article.id"
      :article="article"
      :completion-summary="completionSummaries?.[article.id]"
    />
  </div>
</template>
