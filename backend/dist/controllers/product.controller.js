import * as productService from "../services/product.services.js";
import { asyncHandler } from "../utils/utiles.asyncHanlder.js";
// get all the Products
export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await productService.getProducts();
    res.status(200).json(products);
});
// create a product
export const createTheProduct = asyncHandler(async (req, res) => {
    const input = req.body;
    const products = await productService.createProduct(input);
    res.status(201).json(products);
});
// update the product
export const updateTheProduct = asyncHandler(async (req, res) => {
    const input = req.body;
    const products = await productService.updateProduct(input);
    res.status(200).json(products);
});
//delete the product
export const deleteTheProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
});
//# sourceMappingURL=product.controller.js.map