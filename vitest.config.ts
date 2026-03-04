import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { webdriverio } from '@vitest/browser-webdriverio';

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: webdriverio(),
      instances: [
        {
          browser: 'chrome',
        },
      ],
    },
  },
});
