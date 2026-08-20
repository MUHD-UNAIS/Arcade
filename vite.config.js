import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

function normalizeLittleBigFeelingsAssets() {
  return {
    name: 'normalize-little-big-feelings-assets',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes(`${resolve(__dirname, 'src/games/Little-Big-Feelings')}`)) {
        return null
      }

      if (!/\.(css|html|js)$/.test(id)) return null

      const normalized = code.replace(/(['"`])assets\//g, '$1/assets/')
      return normalized === code ? null : { code: normalized, map: null }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [normalizeLittleBigFeelingsAssets(), react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        arcade: resolve(__dirname, 'index.html'),
        wordsOfWisdom: resolve(__dirname, 'src/games/Words-of-Wisdom/index.html'),
        littleBigFeelings: resolve(__dirname, 'src/games/Little-Big-Feelings/index.html'),
        mindscapeDefense: resolve(__dirname, 'src/games/mindscape-defence/index.html'),
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})

