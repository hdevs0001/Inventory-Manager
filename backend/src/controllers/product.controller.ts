import { Request, Response } from "express";
import * as productService from "../services/product.services.js";
import type {
  product,
  createInventoryProduct,
  updateInventoryProduct,
} from "../types/product.types.js";
import { asyncHandler } from "../utils/utiles.asyncHanlder.js";

type IdParam = { id: string };

// get all the Products
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await productService.getProducts();
    res.status(200).json(products);
  },
);
// create a product
export const createTheProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const input = req.body as createInventoryProduct;
    const products = await productService.createProduct(input);
    res.status(201).json(products);
  },
);
// update the product
export const updateTheProduct = asyncHandler(
  async (req: Request<IdParam>, res: Response) => {
    const input = { id: req.params.id, ...req.body };
    const products = await productService.updateProduct(input);
    res.status(200).json(products);
  },
);
//delete the product
export const deleteTheProduct = asyncHandler(
  async (req: Request<IdParam>, res: Response) => {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  },
);
