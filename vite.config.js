import { defineConfig } from 'vite';

// Set the base path to the repository name for GitHub Pages deployment.
// This ensures assets resolve correctly when served from https://<user>.github.io/ps5-controller-visualizer/
export default defineConfig({
  base: '/ps5-controller-visualizer/',
  server: {
    host: true,
    open: true,
  },
});
