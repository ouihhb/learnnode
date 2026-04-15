import { createRouter, createWebHistory } from 'vue-router'
import RickAndMorty from '../pages/RickAndMorty.vue'
import CanvasExample from '../pages/CanvasExample.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/rickandmorty',
    },
    {
      path: '/rickandmorty',
      name: 'RickAndMorty',
      component: RickAndMorty,
    },
    {
      path: '/canvas',
      name: 'Canvas',
      component: CanvasExample,
    },
  ],
})

export default router