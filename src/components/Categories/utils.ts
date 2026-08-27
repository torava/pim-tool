import type CategoryShape from '@torava/pim-utils/dist/models/Category';
import type ItemShape from '@torava/pim-utils/dist/models/Item';

export const getCategoryItemWithPrice = (category: CategoryShape, items: ItemShape[]) =>
  items.find((item) => item.product?.category?.id === category.id && item.transaction?.totalPrice);
