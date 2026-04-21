import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import { authenticate } from "../../middlewares/authentication.middleware";
import * as cartSchemas from "./cart.validation";
import * as cartController from "./cart.controller";

const router = Router();

router.get("/", authenticate, cartController.viewCart);

router.post("/items", authenticate, validation(cartSchemas.addToCartSchema), cartController.addItem);

router.put("/", authenticate, validation(cartSchemas.modifyCartSchema), cartController.modifyCart);

router.delete("/items/:menuItemId", authenticate, validation(cartSchemas.removeItemSchema), cartController.removeItem);

router.delete("/", authenticate, cartController.clearCart);

router.patch(
  "/item",
  authenticate,
  cartController.updateCartItem
);

export default router;