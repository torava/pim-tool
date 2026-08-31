import memoize from 'memoize';
import type CategoryShape from '@torava/pim-utils/dist/models/Category';
import type ItemShape from '@torava/pim-utils/dist/models/Item';
import { convertMeasure } from '@torava/pim-utils';

export const getCategoryItemWithPrice = memoize((category: CategoryShape, items: ItemShape[]) =>
  items.find((item) => item.product?.category?.id === category.id && item.price)
);
export const getItemQuantity = (item?: ItemShape) => item?.quantity || item?.product?.quantity;
export const getItemMeasure = (item?: ItemShape) => item?.measure || item?.product?.measure;
export const getItemUnit = (item?: ItemShape) => item?.unit || item?.product?.unit;
export const getCategoryUnitPrice = memoize((category: CategoryShape, items: ItemShape[]) => {
  const price = getCategoryItemWithPrice(category, items)?.price;
  const measure = getItemMeasure(getCategoryItemWithPrice(category, items));
  return (
    price &&
    measure &&
    price / convertMeasure(measure || 0, getItemUnit(getCategoryItemWithPrice(category, items)), 'kg')
  );
});
