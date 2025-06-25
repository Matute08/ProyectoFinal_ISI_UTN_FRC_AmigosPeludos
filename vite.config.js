import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    maximumFileSizeToCacheInBytes: 5000000 
  },
  manifest: {
    name: 'Amigos Peludos',
    short_name: 'AP',
    description: 'Ayuda a encontrar, adoptar y cuidar mascotas',
    theme_color: '#ff7b00',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: "/icon-512x512.png",
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: "/icon-512x512.png",
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
})

  ]
})
