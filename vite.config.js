import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/algolia-dropdown-demo/',
  define: {
    'process.env': dotenv.config().parsed
  }
})
