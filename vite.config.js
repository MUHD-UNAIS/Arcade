import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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

