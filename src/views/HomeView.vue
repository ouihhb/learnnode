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
const loading = ref(false)
const searchQuery = ref('')
const noCharactersFound = ref(false)

async function fetchCharacters(page, name = '') {
  try {
    loading.value = true
    noCharactersFound.value = false

    let url = `https://rickandmortyapi.com/api/character?page=${page}`

    if (name.trim()) {
      url += `&name=${encodeURIComponent(name.trim())}`
    }

    const response = await fetch(url)

    if (response.status === 404) {
      characters.value = []
      totalPages.value = 1
      noCharactersFound.value = true
      return
    }

    const data = await response.json()

    characters.value = data.results
    totalPages.value = data.info.pages
  } catch (error) {
    console.error('Ошибка загрузки персонажей:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch(query) {
  searchQuery.value = query
  currentPage.value = 1

  router.push({
    query: {
      page: 1,
      ...(query ? { name: query } : {}),
    },
  })

  fetchCharacters(1, query)
}

function handlePageChange(page) {
  currentPage.value = page
}

onMounted(() => {
  fetchCharacters(currentPage.value, searchQuery.value)
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
</script>

<template>
  <div class="container">
    <h1>Rick & Morty Characters</h1>
    <SearchBar
  v-model="searchQuery"
  :showButton="true"
  @search="handleSearch"
/>

    <transition name="fade" mode="out-in">
      <div :key="currentPage" class="characters-wrapper">
        <p v-if="loading">Loading...</p>

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

</style>