import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import * as authSchemas from "./auth.validation";
import * as authController from "./auth.controller";
import { loginLimiter, forgotPasswordLimiter } from "../../middlewares/rate-limiter";

const router = Router();

router.post("/register", validation(authSchemas.registerSchema), authController.register);
// router.post("/login", loginLimiter, validation(authSchemas.loginSchema), authController.login);
router.post("/login", validation(authSchemas.loginSchema), authController.login);

router.post("/refresh", authController.refresh);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validation(authSchemas.forgotPasswordSchema),
  authController.forgotPassword
);
router.post("/verify-otp", validation(authSchemas.verifyOtpSchema), authController.verifyOtp);
router.post("/reset-password", validation(authSchemas.resetPasswordSchema), authController.resetPassword);

export default router;
