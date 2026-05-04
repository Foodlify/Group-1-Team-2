import { Router } from "express";
import { authenticate } from "../../middlewares/authentication.middleware";

const router = Router();

router.patch('/', authenticate, async (req, res) => {
    res.send("Order cancelled successfully");
});

export default router;