import { Router } from "express";
import * as restaurantController from "./restaurant.controller";
import { validation } from "../../middlewares/validation.middleware";
import * as restaurantValidation from "./restaurant.validation";
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from "../../middlewares/authorize";

import { cache } from "../../config/cache";
import menuRouter from "../menu/menu.route";

const router = Router();

router.use('/:restaurantId/menus', menuRouter);

// create a restaurant
router.post("/", authenticate, authorize("ADMIN"), validation(restaurantValidation.createRestaurant), restaurantController.createRestaurant);


router.get("/:restaurantId", restaurantController.getRestaurant);

router.put("/:id", authenticate, authorize("ADMIN"), restaurantController.updateRestraurant );

router.delete("/:id", authenticate, authorize("ADMIN"),restaurantController.deleteRestraurant);

router.get("/cache/stats", (req, res) => {
    res.json({
        keys: cache.keys(),
        stats: cache.getStats()
    });
});

export default router;