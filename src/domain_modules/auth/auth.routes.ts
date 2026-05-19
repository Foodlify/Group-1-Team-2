import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import { loginSchema, signupSchema } from "./auth.validation";
import { signup,login } from "./auth.controller";

const router = Router();

router.post("/signup", validation(signupSchema),signup);
router.post("/login", validation(loginSchema),login);

export default router;

