<script setup lang="ts">
import { ErrorState, ROUTE_PATHS } from "@shared";
</script>

<template>
  <ErrorState
    eyebrow="404"
    title="Статья не найдена"
    description="Такой статьи нет или ссылка устарела. Вернись к списку и выбери доступный материал."
    action-label="Вернуться к списку статей"
    :action-to="ROUTE_PATHS.home"
  />
</template>
