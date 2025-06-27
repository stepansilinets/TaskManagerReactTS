import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Используем Vite-плагин вместо PostCSS

export default defineConfig({
  plugins: [react(), tailwindcss()],
});