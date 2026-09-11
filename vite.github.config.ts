import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const base = '/narraiana-app/';

export default defineConfig({
  root: root + 'github-pages',
  base,
  publicDir: root + 'public',
  resolve: {alias: {'@': root}},
  plugins: [react()],
  define: {__GITHUB_PAGES__: true, __APP_BASE__: JSON.stringify(base)},
  css: {postcss: root},
  build: {outDir: root + 'docs', emptyOutDir: true},
});
