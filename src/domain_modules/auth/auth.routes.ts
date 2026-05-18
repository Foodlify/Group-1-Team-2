import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import { signupSchema } from "./auth.validation";
import { signup } from "./auth.controller";

const router = Router();

router.post("/signup", validation(signupSchema),signup);

export default router;

