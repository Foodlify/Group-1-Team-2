import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import { authenticate } from "../../middlewares/authentication.middleware";
import * as orderSchemas from "./order.validation";
import * as orderController from "./order.controller";

const router = Router();

router.get("/", authenticate, orderController.viewOrders);
router.get("/:orderId", authenticate, validation(orderSchemas.getOrderSchema), orderController.viewOrder);

export default router;
