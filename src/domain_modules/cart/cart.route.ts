import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import * as cartSchemas from "./cart.validation";
import * as cartController from "./cart.controller";

const router = Router();

router.post("/items", validation(cartSchemas.addToCartSchema), cartController.addItem);


router.get("/:userId", cartController.viewCart)


router.put("/", validation(cartSchemas.modifyCartSchema), cartController.modifyCart);
//remove item from cart
router.delete("/remove", validation(cartSchemas.removeItemSchema), cartController.removeItem);

export default router;