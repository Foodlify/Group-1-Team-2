import { Router } from "express";
import { authenticate } from "../../middlewares/authentication.middleware";
import * as orderController from "./customer.controller";


const router = Router();

router.get("/me", authenticate, orderController.getProfile);

export default router;
