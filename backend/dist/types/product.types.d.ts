export interface product {
    id: string;
    name: string;
    price: string;
    quantity: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface createInventoryProduct {
    name: string;
    price: string;
    quantity: string;
}
export interface updateInventoryProduct {
    id: string;
    name?: string;
    price?: string;
    quantity?: string;
}
//# sourceMappingURL=product.types.d.ts.map