// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Inclusive Sans',
        weights: [400, 500, 600, 700],
        cssVariable: '--font-body'
      },
      {
        provider: "local",
        name: "RasterForgeRegular",
        cssVariable: "--font-heading",
        variants: [
          {
            src: [
              "./src/assets/RasterForgeRegular.woff2"
            ]
            }
        ]
      },
      {
        provider: "local",
        name: "Gill Sans Italic",
        cssVariable: "--font-pill",
        variants: [
          {
            src: [
              "./src/assets/GillSansItalic.otf"
            ]
          }
        ]
      }
    ]
  },

  integrations: [react()]
});