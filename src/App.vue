<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <nav class="main-nav" aria-label="Main navigation">
      <RouterLink to="/rickandmorty">Rick and Morty</RouterLink>
      <RouterLink to="/canvas">Canvas</RouterLink>
      <RouterLink to="/resize-observer">Resize Observer API</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
}

.main-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.main-nav a {
  border: 1px solid #d7dee8;
  border-radius: 6px;
  padding: 8px 12px;
  color: #1f2937;
}

.main-nav a.router-link-active {
  border-color: #2374ab;
  background: #e8f3fb;
  color: #155276;
}
</style>
