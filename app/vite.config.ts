import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      base: '/opti-via/',  // Match your base path
      manifest: {
        name: 'Opti Via',
        short_name: 'app',
        description: 'Aplicacion para transporte publico',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/opti-via/',
        start_url: '/opti-via/',
        icons: [
          {
            src: '/opti-via/img/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/opti-via/img/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/opti-via/img/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  base: '/opti-via/',
})