import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

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

test('filters items by name', async () => {
  const { getByText } = await render(
    <Items attributes={mockAttributes} items={mockItems} locale="en-US" onLocaleChange={() => {}} />
  );

  const searchInput = document.querySelector('input[aria-label="Search by item name"]') as HTMLInputElement;
  expect(searchInput).not.toBeNull();

  userEvent.type(searchInput, 'tuna');

  await expect.element(getByText(mockItems[0].product?.name!)).not.toBeInTheDocument();
  await expect.element(getByText(mockItems[1].product?.name!)).toBeInTheDocument();
});
