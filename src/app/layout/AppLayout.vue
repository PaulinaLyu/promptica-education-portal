<script setup lang="ts">
import AppFooter from "./AppFooter.vue";
import AppHeader from "./AppHeader.vue";
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F7F5EC] text-stone-950">
    <AppHeader />

    <main class="mx-auto flex w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
