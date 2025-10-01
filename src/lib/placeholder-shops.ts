import data from './placeholder-shops.json';

export type ShopPlaceholder = {
  id: string;
  name: string;
  category: string;
  location: string;
  imageId: string;
};

// @ts-ignore
export const PlaceholderShops: ShopPlaceholder[] = data.placeholderShops || [];
