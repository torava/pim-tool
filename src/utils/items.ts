import type ItemShape from '@torava/pim-utils/dist/models/Item';

export const getItemQuantity = (item?: ItemShape) => item?.quantity || item?.product?.quantity;
export const getItemMeasure = (item?: ItemShape) => item?.measure || item?.product?.measure;
export const getItemUnit = (item?: ItemShape) => item?.unit || item?.product?.unit;
