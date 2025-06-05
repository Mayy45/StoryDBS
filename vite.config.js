import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base:'/StoryDBS/',
  server: {
    proxy: {
      '/v1': {
        target: 'https://story-api.dicoding.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, '/v1'),
        secure: true
      },
    },
  },
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icons/icon-192x192.png', 'icons/icon-512x512.png'],
      manifest: {
        name: 'Story APP',
        short_name: 'My Story',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b883',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
  globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-cache',
      },
    },
    {
      urlPattern: ({ request }) =>
        ['style', 'script', 'worker'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'asset-cache',
      },
    },
    {
      urlPattern: ({ url }) => url.origin === self.location.origin,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
      },
    },
    // Tambahkan rule berikut untuk API Dicoding:
    {
      urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  navigateFallback: 'index.html',
},

    }),
  ],
});
