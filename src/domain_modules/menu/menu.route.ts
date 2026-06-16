import { Router } from "express";
const router = Router({ mergeParams: true });
import * as menuController from "./menu.controller";
import  * as menuValidation from "./menu.validation";
import { validation } from "../../middlewares/validation.middleware";

import { isAuthenticated } from "../../middlewares/authentication.middleware";
import { isAuthorized } from "../../middlewares/authorization.middleware";

import menuItemRouter from "../menuItem/menuItem.route";

router.use("/:menuId/items", menuItemRouter);

router.post("/", isAuthenticated, isAuthorized("ADMIN"), validation(menuValidation.createMenu), menuController.createMenu);
router.get("/", validation(menuValidation.getMenus), menuController.getMenus);

router.get("/:menuId", validation(menuValidation.getMenu), menuController.getMenu);

router.delete("/:menuId",isAuthenticated, isAuthorized("ADMIN"), validation(menuValidation.deleteMenu), menuController.deleteMenu);

export default router;