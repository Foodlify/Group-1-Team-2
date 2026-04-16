import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import { addToCartSchema } from "./cart.validation";
import * as cartController from "./cart.controller";

const router = Router();

router.post("/items", validation(addToCartSchema), cartController.addItem);


router.get("/:userId" , cartController.viewCart)

export default router;