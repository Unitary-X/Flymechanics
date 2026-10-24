import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nitro } from 'nitro/vite'

export default defineConfig({
  server: { port: 3000 },
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), nitro({
      // Hashed build files never change; the films are fetched again at most once a day, and may be served stale
      // while they refresh, so a returning visitor does not download them again.
      routeRules: {
        '/assets/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
        '/media/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
      },
    }), viteReact()],
})
