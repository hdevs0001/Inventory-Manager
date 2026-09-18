import type { product, createInventoryProduct, updateInventoryProduct } from "../types/product.types.js";
export declare function getProducts(): Promise<product[]>;
export declare function createProduct(input: createInventoryProduct): Promise<product>;
export declare function updateProduct(input: updateInventoryProduct): Promise<product>;
export declare function deleteProduct(id: string): Promise<void>;
//# sourceMappingURL=product.services.d.ts.map