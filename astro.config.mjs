// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import node from '@astrojs/node';

import react from '@astrojs/react';

import svgr from 'vite-plugin-svgr';

import awsAmplify from 'astro-aws-amplify';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), svgr()],
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            firebase: [
              'firebase/app',
              'firebase/auth',
              'firebase/firestore',
              'firebase/storage',
              'firebase/messaging',
            ],
            'ui-components': ['framer-motion', 'react-toastify'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
  integrations: [icon(), react()],
  output: 'server',
  adapter: awsAmplify(),	
//  adapter: node({
//    mode: 'standalone',
//  }),
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
