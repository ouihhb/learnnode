<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  showButton: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'search'])

const localQuery = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    localQuery.value = newValue
  }
)

function handleInput() {
  emit('update:modelValue', localQuery.value)
}

function handleSearch() {
  emit('search', localQuery.value.trim())
}
</script>

<template>
  <div class="search-bar">
    <input
      v-model="localQuery"
      type="text"
      placeholder="Search character by name..."
      @input="handleInput"
      @keyup.enter="handleSearch"
    />

    <button v-if="showButton" @click="handleSearch">
      Search
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-bar input {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 280px;
  font-size: 16px;
}

.search-bar button {
  padding: 10px 16px;
  border: none;
  background: #42b883;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.search-bar button:hover {
  opacity: 0.9;
}
</style>