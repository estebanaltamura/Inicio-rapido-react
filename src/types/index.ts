export interface Field {
  label: string;
  type: 'string' | 'boolean' | 'number' | 'timestamp' | 'geoPoint';
  name: string;
}

export enum Entities {
  'products' = 'products',
  'purchases' = 'purchases',
}

export type EntityTypesMapReturnedValues = {
  [Entities.products]: IProductEntity;
  [Entities.purchases]: IPurchaseEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.products]: IProduct;
  [Entities.purchases]: IPurchase;
};

export interface IProductEntity extends IProduct {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseEntity extends IPurchase {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchase {
  productId: string;
}

export interface IProduct {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  productCategory: ProductCategoryTypes;
}

export enum ProductCategoryTypes {
  'food' = 'food',
  'videoGamesTime' = 'videoGamesTime',
  'toys' = 'toys',
  'screenTime' = 'screenTime',
}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
