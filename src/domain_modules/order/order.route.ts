import { Router } from "express";
import { authenticate } from "../../middlewares/authentication.middleware";
import { validation } from "../../middlewares/validation.middleware";
import * as orderSchemas from "./order.validation";
import * as orderController from "./order.controller";
import { protect } from './../auth/auth.services';

const router = Router();

router.post("/createOrder", protect, validation(orderSchemas.createOrderSchema), orderController.createOrder);

export default router;
