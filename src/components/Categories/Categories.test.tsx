import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

afterEach(() => {
  document.body.innerHTML = '';
});

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

test('filters categories by name', async () => {
  const categories = [
    {
      id: 1,
      name: { 'en-US': 'Food', 'fi-FI': 'Ruoka', 'sv-SE': 'Mat' },
      aliases: undefined,
      parentId: undefined,
      attributes: [],
    },
    {
      id: 2,
      name: { 'en-US': 'Fruit', 'fi-FI': 'Hedelmä', 'sv-SE': 'Frukt' },
      aliases: undefined,
      parentId: undefined,
      attributes: [],
    },
  ];

  const { getByText } = await render(
    <Categories
      attributes={mockAttributes}
      categories={categories}
      items={mockItems}
      locale="en-US"
      onLocaleChange={() => {}}
    />
  );

  const searchInput = document.querySelector('input[aria-label="Search by category name"]') as HTMLInputElement;
  expect(searchInput).not.toBeNull();

  searchInput.value = 'fruit';
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  searchInput.dispatchEvent(new Event('change', { bubbles: true }));

  await expect.element(getByText('Fruit')).toBeInTheDocument();
});
