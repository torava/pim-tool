import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { Categories } from './Categories';
import { mockAttributes, mockCategories, mockItems } from '../../utils/mccks';

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
    <Categories
      attributes={mockAttributes}
      categories={mockCategories}
      items={mockItems}
      locale="en-US"
      onLocaleChange={() => {}}
    />
  );

  await expect.element(getByText(mockCategories[0].name?.['en-US']!)).toBeInTheDocument();
});
