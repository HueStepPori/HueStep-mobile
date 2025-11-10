// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const isProd = process.env.GITHUB_ACTIONS === 'true' || process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  base: isProd ? '/HueStep/' : '/',
})
