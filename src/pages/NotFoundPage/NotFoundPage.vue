<script setup lang="ts">
import { ErrorState, ROUTE_PATHS } from "@shared";
</script>

<template>
  <ErrorState
    eyebrow="404"
    title="Страница не найдена"
    description="Такой страницы нет. Можно вернуться на главную и продолжить курс."
    action-label="На главную"
    :action-to="ROUTE_PATHS.home"
  />
</template>
