import { Request, Response } from "express";
import * as productService from "../services/product.services";
import type {
  product,
  createInventoryProduct,
  updateInventoryProduct,
} from "../types/product.types";
import { asyncHandler } from "../utils/utiles.asyncHanlder";

type IdParam = { id: string };

// get all the Products
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await productService.getProducts();
    res.status(200).json(products);
  },
);
//