import { defineConfig } from 'vite';

/**
 * Builds the CMS preview bundle.
 *
 * The same .tsx components render on the site and in the preview pane, but they
 * compile differently for each:
 *
 *   site    — Astro + @astrojs/react, automatic JSX runtime, real React
 *   preview — classic JSX runtime against Sveltia's own `h` / `rf` globals
 *
 * Using Sveltia's React matters: the templates render inside ITS React tree, and
 * two copies of React in one tree breaks hooks and context. Compiling to bare
 * `h()` calls means we never load a second one.
 *
 * Output goes to public/admin/ so it ships as a plain static file.
 */
export default defineConfig({
  // outDir sits inside public/, so Vite's own public-dir copying must be off.
  publicDir: false,
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'h',
    jsxFragment: 'rf',
  },
  build: {
    outDir: 'public/admin',
    emptyOutDir: false,
    cssCodeSplit: false,
    minify: true,
    lib: {
      entry: 'src/admin/preview.tsx',
      formats: ['iife'],
      name: 'BushtalkPreview',
      fileName: () => 'preview-bundle.js',
    },
    rollupOptions: {
      output: { assetFileNames: 'preview-bundle.[ext]' },
    },
  },
});
