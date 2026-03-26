<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

const visiblePages = computed(() => {
  const current = props.currentPage
  const total = props.totalPages

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
})

function goToPage(page) {
  if (page === '...') return
  if (page < 1 || page > props.totalPages) return
  if (page === props.currentPage) return

  emit('page-change', page)
}
</script>

<template>
  <nav class="pagination">
    <button
      class="nav-btn"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      Previous
    </button>

    <button
      v-for="(page, index) in visiblePages"
      :key="`${page}-${index}`"
      class="page-btn"
      :class="{ active: page === currentPage, dots: page === '...' }"
      :disabled="page === '...'"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      class="nav-btn"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      Next
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.page-btn,
.nav-btn {
  padding: 8px 14px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.2s;
}

.page-btn:hover,
.nav-btn:hover {
  background: #f3f3f3;
}

.page-btn.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

.page-btn.dots {
  cursor: default;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>