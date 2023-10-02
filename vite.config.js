import { defineConfig } from 'vitest/config';

import config from './scripts/vite/vite.config.js';

if (!process.env.VITEST) {
  throw new Error('The root /vite.config.js is only meant for vitest. Please use /scripts/vite/vite.config.js');
}

export default defineConfig({
  ...config({
    mode: 'test',
    command: 'serve',
  }),
  test: {
    threads: false,
  },
});
