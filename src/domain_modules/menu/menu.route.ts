import { Router } from "express";
const router = Router({ mergeParams: true });
import * as menuController from "./menu.controller";
import  * as menuValidation from "./menu.validation";
import { validation } from "../../middlewares/validation.middleware";


router.post("/", validation(menuValidation.createMenu), menuController.createMenu);
router.get("/", validation(menuValidation.getMenus), menuController.getMenus);

export default router;