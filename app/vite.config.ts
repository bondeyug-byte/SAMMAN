import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Single-file build so the prototype can be hosted as one static page.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { target: 'es2019', cssCodeSplit: false },
});
