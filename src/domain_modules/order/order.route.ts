import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import * as orderSchemas from "./order.validation";
import * as orderController from "./order.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.post("/", authenticate, validation(orderSchemas.createOrderSchema), orderController.createOrder);
router.get("/", orderController.viewOrders);
router.get("/:orderId", validation(orderSchemas.getOrderSchema), orderController.viewOrder);

export default router;