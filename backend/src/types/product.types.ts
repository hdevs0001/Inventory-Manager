export interface product {
  id: string;
  name: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface createInventoryProduct {
  name: string;
  price: string;
}

export interface updateInventoryProduct {
  name?: string;
  price?: string;
}

