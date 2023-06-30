import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
   plugins: [
      react(),
      tsconfigPaths(),
      electron([
         {
            entry: 'electron/main.ts',
         },
         {
            entry: 'electron/preload.ts',
            onstart(options) {
               options.reload()
            },
         },
         {
            entry: 'electron/additionalPreload.ts',
            onstart(options) {
               options.reload()
            },
         }
      ]),
      renderer(),
   ],
})
