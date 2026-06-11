import { createRouter, createWebHashHistory } from 'vue-router'
import RickAndMorty from '../pages/RickAndMorty.vue'
import CanvasExample from '../pages/CanvasExample.vue'
import ResizeObserverDemo from '../pages/ResizeObserverDemo.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
    {
      path: '/resize-observer',
      name: 'Resize Observer API',
      component: ResizeObserverDemo,
    },
  ],
})

export default router
