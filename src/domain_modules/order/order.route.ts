import { Router } from "express";
import { authenticate } from "../../middlewares/authentication.middleware";
import { validation } from "../../middlewares/validation.middleware";
import * as orderSchemas from "./order.validation";
import * as orderController from "./order.controller";


const router = Router();
router.post("/createOrder" ,authenticate,validation(orderSchemas.createOrderSchema),orderController.createOrder);

export default router;