import { Router } from "express";
import cartRoutes from "../domain_modules/cart/cart.route";
import orderRoutes from "../domain_modules/order/order.route";
import customerRoutes from "../domain_modules/customer/customer.route";
import restaurantRoutes from "../domain_modules/restaurant/restaurant.route";
import authRoutes from "../domain_modules/auth/auth.routes";

const router = Router();



router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/customer", customerRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/auth", authRoutes);

export default router;