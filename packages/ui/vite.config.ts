import { libInjectCss as vitePluginLibInjectCss } from 'vite-plugin-lib-inject-css'
import vitePluginReact from '@vitejs/plugin-react'
import vitePluginDts from 'vite-plugin-dts'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import pkg from './package.json'
import { globSync } from 'glob'
import path from 'path'

/*
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [vitePluginReact(), vitePluginLibInjectCss(), vitePluginDts({ include: ['src'] })],

  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [...Object.keys(pkg?.peerDependencies || {}), 'react/jsx-runtime'],
      input: Object.fromEntries(
        /*
         * @see https://vitejs.dev/guide/api-plugin.html#vite-plugin-lib-inject-css*
         */
        globSync('src/**/*.{ts,tsx}').map(file => [
          // 1. The name of the entry point
          // lib/nested/foo.js becomes nested/foo
          path.relative('src', file.slice(0, file.length - path.extname(file).length)),
          // 2. The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url)),
        ])
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
        chunkFileNames: `[name].js`,
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
})
