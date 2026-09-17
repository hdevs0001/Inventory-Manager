//first import the client (which is prisma)
import { prisma } from "../db/prisma";
//importing the custom error from error.ts form utils
import { NotFoundError, ValidationError } from "../utils/utils.error";
//import the type for the services
import type {
  product,
  createInventoryProduct,
  updateInventoryProduct,
} from "../types/product.types";

// get all the tasks
export async function getProducts(): Promise<product[]> {
  return await prisma.products.findMany();
}

//creating the product or you can say adding the product in the inventory
export async function createProduct(
  input: createInventoryProduct,
): Promise<product> {
  if (!input.name || input.name.trim().length === 0) {
    throw new ValidationError("Title is Required");
  }
  return await prisma.products.create({
    data: {
      name: input.name.trim(),
      price: input.price,
      quantity: input.quantity,
    },
  });
}
//update the product name , price and quantity any
export async function updateProduct(
  input: updateInventoryProduct,
): Promise<product> {
  if (!input.name && !input.price && !input.quantity) {
    throw new ValidationError("One Of The Field Is Required");
  }

  return await prisma.products.update({
    where: { id: input.id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.quantity !== undefined && { quantity: input.quantity }),
    },
  });
}

// delete the item/Product form the inventory

export async function deleteProduct(id: string): Promise<void> {
  const deleted = await prisma.products.delete({ where: { id: id } });
  if (!deleted) {
    throw new NotFoundError(`Task with id ${id} not Found`);
  }
}
