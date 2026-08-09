import { Router } from "express";
import * as orderController from "./customer.controller";
import { validation } from "../../middlewares/validation.middleware";
import { updateProfileSchema } from "./customer.validation";


const router = Router();

router.get("/me", orderController.getProfile); 

router.put("/me", validation(updateProfileSchema), orderController.updateProfile);


export default router;
