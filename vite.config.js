import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/workout-tracker/',
  server: {
    host: true, // Povolí přístup z localhostu i z mobilu na lokální síti
    port: 5173
  }
})
