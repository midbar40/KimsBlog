import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@utils": path.resolve(__dirname, "src/lib/utils"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
    },
  },
})
