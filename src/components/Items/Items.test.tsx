import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { mockAttributes, mockItems } from '../../utils/mccks';
import { Items } from './Items';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/categories',
    hash: '',
    key: 'default',
  }),
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

test('renders successfully', async () => {
  const { getByText } = await render(
    <Items
      attributes={mockAttributes}
      items={mockItems}
      locale="en-US"
      onLocaleChange={() => {}}
    />
  );

  await expect.element(getByText(mockItems[0].product?.name!)).toBeInTheDocument();
});
