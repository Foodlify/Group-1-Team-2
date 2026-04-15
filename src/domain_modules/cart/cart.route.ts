import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import { addToCartSchema } from "./cart.validation";

const router = Router();

router.post("/items", validation(addToCartSchema), (req, res) => {
  res.json({ message: "Add to cart" });
});

router.get("/", (req, res) => {
  res.json({ message: "Get cart" });
});

export default router;