import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/lol-matchup-web/',
  plugins: [react()],
})
