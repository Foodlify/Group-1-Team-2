import { Router } from "express";
import { authenticate } from "../../middlewares/authentication.middleware";
import * as orderController from "./customer.controller";
import { validation } from "../../middlewares/validation.middleware";
import { updateProfileSchema } from "./customer.validation";


const router = Router();

router.get("/me", authenticate, orderController.getProfile); 

router.put("/me", authenticate, validation(updateProfileSchema), orderController.updateProfile);


export default router;
