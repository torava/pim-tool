import memoize from 'memoize';
import type CategoryShape from '@torava/pim-utils/dist/models/Category';
import type ItemShape from '@torava/pim-utils/dist/models/Item';
import { convertMeasure } from '@torava/pim-utils';
import { getItemMeasure, getItemUnit } from '../../utils/items';

export const getCategoryItemWithPrice = memoize((category: CategoryShape, items: ItemShape[]) =>
  items.find((item) => item.product?.category?.id === category.id && item.price)
);
export const getCategoryUnitPrice = memoize((category: CategoryShape, items: ItemShape[]) => {
  const price = getCategoryItemWithPrice(category, items)?.price;
  const measure = getItemMeasure(getCategoryItemWithPrice(category, items));
  return (
    price &&
    measure &&
    price / convertMeasure(measure || 0, getItemUnit(getCategoryItemWithPrice(category, items)), 'kg')
  );
});
