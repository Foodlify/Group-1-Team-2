import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import * as authSchemas from "./auth.validation";
import * as authController from "./auth.controller";

const router = Router();

router.post("/signup", validation(authSchemas.signupSchema), authController.signup);
router.post("/login", validation(authSchemas.loginSchema), authController.login);

router.post("/forget-password", validation(authSchemas.forgetPasswordSchema), authController.forgetPassword);

router.post("/reset-password", validation(authSchemas.resetPasswordSchema), authController.resetPassword);


export default router;


