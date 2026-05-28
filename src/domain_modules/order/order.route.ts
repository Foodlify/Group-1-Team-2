import { Router } from "express";
import { authenticate } from "../../middlewares/authentication.middleware";
import { validation } from "../../middlewares/validation.middleware";
import * as orderSchemas from "./order.validation";
import * as orderController from "./order.controller";
import { protect } from './../auth/auth.services';

const router = Router();

router.post("/createOrder", protect, validation(orderSchemas.createOrderSchema), orderController.createOrder);
router.post("/", authenticate, validation(orderSchemas.createOrderSchema), orderController.createOrder);
router.get("/", authenticate, orderController.viewOrders);
router.get("/:orderId", authenticate, validation(orderSchemas.getOrderSchema), orderController.viewOrder);

export default router;
