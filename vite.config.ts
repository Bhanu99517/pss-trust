import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const SUPABASE_IMAGES = [
  // Logo & Chairman
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/a84f56a0-4104-45b1-8c19-e9d129a3f77f.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/09572fd3-89d2-44ec-a9ad-be7ef63729bf.jpg",
  // Gallery / Slider images
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/aff82b67-7639-4645-833e-b9d51e5441e6.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/9015272e-26b9-46f8-ad31-b931f292a3d1.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/36fd1bc9-9df7-43ec-8686-90df6c5d31dc.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/93220445-fe4a-42c6-9cac-08abeb372b38.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/3e5bcc9c-59e6-44eb-9016-076f7cbfadfd.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/739400e4-e418-4e8a-9c42-cddfa08d7544.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/b266f044-4c1c-4f3b-823f-f9cea6aaabf0.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/deee7881-f390-43b3-9c48-2289be3d1067.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/269bea2b-93f7-433f-9e30-2f13f923c179.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/6e40a619-8b3a-47a5-a418-3a089321fdbe.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/56a3bbfc-333d-447b-930c-772395f60a4f.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/1b98bad8-6919-4bda-bd84-d618ac5b59b5.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/05f365dd-b90a-4695-bf65-23c1d90c535a.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/2a1ba494-c713-4c53-b762-a49c12092de9.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/fb0bcef2-81a3-449f-9c3f-fc65c2ca2a4c.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/8e64ce0b-a89b-496a-bddf-4a358a89a962.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/1a1e03a0-2967-46b5-89ae-10dcd796aa1e.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/f101dc7a-f22c-4a8b-b455-75bc633e676b.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/0c9a2501-4f02-455e-b622-4e78b22064a5.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/da27a9a3-4a74-4654-846e-bc73d8942e11.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/57a8bd18-ca38-40ca-a16d-057981b54064.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/02dd4002-b2f6-4351-8162-272e904f32f7.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/e374ed58-81a8-45ac-ad7e-453f09ace2ab.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/974e4549-30b9-4cce-9a10-4ea107da6b4f.png",
  // ab6540cd bucket images
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/855f571e-bf2a-49af-8489-ecd2a9620a83.jpeg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/c69529a8-311a-419f-adeb-df9cd3af9438.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/1ad28687-e12b-4c93-92ea-471e5a0a5eea.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/a7aad6d0-99e3-4bba-bd7d-079d8ca44759.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/76199a7d-ee77-4da8-8c15-0e8fbca6edc9.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/bcae1156-b60a-49d8-ade8-480babbc0c30.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/c49da551-52b4-43a0-857c-634310904541.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/59b362e2-a3c9-4fe8-a389-8d76018d85d5.webp",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/94a3be94-860f-4fee-80e1-47708d0fbbd9.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/976fd28d-8f32-435a-acea-0d4333088197.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/b57e5e3a-6913-4c1b-84f2-71cdd2b6d582.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/9776d871-24c9-477e-aa8e-55c04ea6b8d4.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/7a0d93cf-5ae7-4d6a-bf3c-211359def5ec.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/e06ee21f-20cb-4d33-b854-4a28db1058c7.jpg",
  "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/63e678fc-7588-4fa1-8e27-26c5eb0f6482.jpg",
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'PSS Trust Student Portal',
          short_name: 'PSS Trust',
          description: 'Student management portal for PSS Trust NGO',
          id: '/',                          // ← fixes "add an id" warning
          theme_color: '#1a1a2e',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          orientation: 'portrait',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            },
          ],
          screenshots: [
            {
              src: '/screenshot-mobile.png',
              sizes: '720x1600',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'PSS Trust Student Portal'
            },
            {
              src: '/screenshot-desktop.png',
              sizes: '1905x1036',
              type: 'image/png',
              form_factor: 'wide',
              label: 'PSS Trust Student Portal'
            },
          ],
        },
        workbox: {
          // Cache local app files
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
          globIgnores: ['**/models/**'],
          // Cache all Supabase images at runtime
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                url.origin === 'https://wojpyqvcargyffkyxfln.supabase.co',
              handler: 'CacheFirst',
              options: {
                cacheName: 'supabase-images',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
          // Pre-cache all image URLs so they're available immediately offline
          additionalManifestEntries: SUPABASE_IMAGES.map((url) => ({
            url,
            revision: null,
          })),
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      exclude: ['face-api.js'],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});