import type CategoryShape from '@torava/pim-utils/dist/models/Category';
import type ItemShape from '@torava/pim-utils/dist/models/Item';

export const getCategoryItemWithPrice = (category: CategoryShape, items: ItemShape[]) =>
  items.find((item) => item.product?.category?.id === category.id && item.price);
export const getItemQuantity = (item?: ItemShape) => item?.quantity || item?.product?.quantity;
export const getItemMeasure = (item?: ItemShape) => item?.measure || item?.product?.measure;
export const getItemUnit = (item?: ItemShape) => item?.unit || item?.product?.unit;
