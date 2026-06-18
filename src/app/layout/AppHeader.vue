<script setup lang="ts">
import { ROUTE_PATHS } from "@shared";
</script>

<template>
  <header class="border-b border-stone-200/70">
    <div
      class="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5"
    >
      <RouterLink
        class="flex items-center gap-2 text-sm font-bold text-stone-950"
        :to="ROUTE_PATHS.home"
        aria-label="На главную"
      >
        <span
          class="flex size-5 items-center justify-center rounded-full bg-stone-950 text-[10px] text-accent"
        >
          ✦
        </span>
        <span>промптика</span>
      </RouterLink>

      <nav
        class="flex items-center gap-6 text-sm text-stone-500"
        aria-label="Основная навигация"
      >
        <RouterLink
          class="transition hover:text-stone-950"
          :to="ROUTE_PATHS.home"
          >Статьи</RouterLink
        >
        <RouterLink
          class="transition hover:text-stone-950"
          :to="ROUTE_PATHS.uiPlayground"
        >
          UI Playground
        </RouterLink>
        <RouterLink
          class="transition hover:text-stone-950"
          :to="ROUTE_PATHS.exercisePlayground"
        >
          Exercises
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
