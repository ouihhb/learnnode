import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const isGitHubPages = process.env.VITE_DEPLOY_TARGET === 'github-pages'

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPages ? '/learnnode/' : '/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
