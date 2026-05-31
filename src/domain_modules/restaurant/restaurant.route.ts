import { Router } from "express";
import * as restaurantController from "./restaurant.controller";
import { cache } from "../../config/cache";
import menuRouter from "../menu/menu.route";

const router = Router();

router.use('/:restaurantId/menus', menuRouter);


router.get("/:id", restaurantController.getRestaurant);

router.put("/:id", restaurantController.updateRestraurant );

router.delete("/:id", restaurantController.deleteRestraurant);

router.get("/cache/stats", (req, res) => {
    res.json({
        keys: cache.keys(),
        stats: cache.getStats()
    });
});

export default router;