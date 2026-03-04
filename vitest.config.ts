import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { webdriverio } from '@vitest/browser-webdriverio';

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        {
          browser: 'chromium',
          provider: webdriverio({
            capabilities: {
              'goog:chromeOptions': {
                args: ['disable-gpu', 'no-sandbox', 'disable-setuid-sandbox'],
              },
            },
          }),
        },
      ],
    },
  },
});
