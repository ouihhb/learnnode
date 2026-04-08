<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaginationBar from '../components/PaginationBar.vue'
import SearchBar from '../components/SearchBar.vue'

const route = useRoute()
const router = useRouter()

const characters = ref([])
const currentPage = ref(Number(route.query.page) || 1)
const totalPages = ref(1)
const totalCount = ref(0)
const loading = ref(false)
const searchQuery = ref('')
const noCharactersFound = ref(false)

let controller = null

function debounce(fn, delay) {
  let timeoutId

  return function (...args) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

async function fetchCharacters(page, name = '') {
  if (controller) {
    controller.abort()
  }

  controller = new AbortController()

  try {
    loading.value = true
    noCharactersFound.value = false

    let url = `https://rickandmortyapi.com/api/character?page=${page}`

    if (name.trim()) {
      url += `&name=${encodeURIComponent(name.trim())}`
    }

    const response = await fetch(url, {
      signal: controller.signal,
    })

    if (response.status === 404) {
      characters.value = []
      totalPages.value = 1
      totalCount.value = 0
      noCharactersFound.value = true
      return
    }

    const data = await response.json()

    characters.value = data.results
    totalPages.value = data.info.pages
    totalCount.value = data.info.count
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Ошибка загрузки персонажей:', error)
    }
  } finally {
    loading.value = false
  }
}

const debouncedFetch = debounce((page, name) => {
  fetchCharacters(page, name)
}, 400)


function handlePageChange(page) {
  currentPage.value = page
}

onMounted(() => {
  fetchCharacters(currentPage.value, searchQuery.value)
})

watch(searchQuery, (newQuery) => {
  currentPage.value = 1

  router.push({
    query: {
      page: 1,
      ...(newQuery ? { name: newQuery } : {}),
    },
  })

  debouncedFetch(1, newQuery)
})

watch(currentPage, (newPage) => {
  fetchCharacters(newPage, searchQuery.value)

  router.push({
    query: {
      page: newPage,
      ...(searchQuery.value ? { name: searchQuery.value } : {}),
    },
  })

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
})

watch(
  () => route.query.page,
  (newPage) => {
    const pageFromUrl = Number(newPage) || 1

    if (pageFromUrl !== currentPage.value) {
      currentPage.value = pageFromUrl
    }
  }
)


// Questions:
// 1. How many API requests were made while typing "morty"?
//    5 requests, one for each typed character.
//
// 2. What happens if a slow request from keystroke 2 arrives after keystroke 5?
//    An older response can arrive later and overwrite newer results.
//
// 3. How does this affect the server and the user experience?
//    It sends too many unnecessary requests, increases server load,
//    and can make the UI show outdated or flickering results.

</script>

<template>
  <div class="container">
    <h1>Rick & Morty Characters</h1>
   <SearchBar v-model="searchQuery" />
   <p v-if="searchQuery && !loading && !noCharactersFound" class="results-count">
  Total results: {{ totalCount }}
</p>

    <transition name="fade" mode="out-in">
      <div :key="currentPage" class="characters-wrapper">
       <div v-if="loading" class="loading-block">
  <div class="spinner"></div>
  <p>Loading...</p>
</div>

        <p v-else-if="noCharactersFound" class="empty-state">
  No characters found
</p>

        <div v-else class="characters-list">
          <div v-for="character in characters" :key="character.id" class="character-card">
            <img :src="character.image" :alt="character.name" />
            <h3>{{ character.name }}</h3>
            <p>Status: {{ character.status }}</p>
            <p>Species: {{ character.species }}</p>
          </div>
        </div>
      </div>
    </transition>

    <PaginationBar
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.characters-wrapper {
  min-height: 600px;
}

.characters-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.character-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  background: white;
}

.character-card img {
  width: 100%;
  border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.empty-state {
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
  color: #777;
}

.results-count {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.loading-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #ddd;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>