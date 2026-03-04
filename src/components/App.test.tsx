import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import App from './App';

test('renders successfully', async () => {
  const { getByTestId } = await render(<App />);

  await expect.element(getByTestId('file')).toBeInTheDocument();
});
