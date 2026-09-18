import { Router } from "express";
import * as productController from "../controllers/product.controller.js";

const router = Router();

//get
router.get("/", productController.getAllProducts);
//create
router.post("/", productController.createTheProduct);
//update
router.patch("/:id", productController.updateTheProduct);
// delete
router.delete("/:id", productController.deleteTheProduct);

export default router;
