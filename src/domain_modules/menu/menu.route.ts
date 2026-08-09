import { Router } from "express";
const router = Router({ mergeParams: true });
import * as menuController from "./menu.controller";
import  * as menuValidation from "./menu.validation";
import { validation } from "../../middlewares/validation.middleware";

import { authenticate } from '../../middlewares/authenticate';
import { authorize } from "../../middlewares/authorize";

import menuItemRouter from "../menuItem/menuItem.route";

router.use("/:menuId/items", menuItemRouter);

router.post("/", authenticate, authorize("ADMIN"), validation(menuValidation.createMenu), menuController.createMenu);
router.get("/", validation(menuValidation.getMenus), menuController.getMenus);

router.get("/:menuId", validation(menuValidation.getMenu), menuController.getMenu);

router.delete("/:menuId",authenticate, authorize("ADMIN"), validation(menuValidation.deleteMenu), menuController.deleteMenu);

export default router;