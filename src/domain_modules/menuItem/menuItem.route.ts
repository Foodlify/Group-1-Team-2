import { Router } from 'express';
const router = Router({ mergeParams: true });
import * as menuItemController from './menuItem.controller';
import * as menuItemSchema from './menuItem.schema';
import { validation } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from "../../middlewares/authorize";

router.post('/', authenticate, authorize("ADMIN"), validation(menuItemSchema.createMenuItem), menuItemController.createMenuItem);

router.get('/:menuItemId', validation(menuItemSchema.getMenuItemById), menuItemController.getMenuItemById);

router.get('/', validation(menuItemSchema.getMenuItemsByMenuId), menuItemController.getMenuItemsByMenuId);

router.put('/:menuItemId', authenticate, authorize("ADMIN"), validation(menuItemSchema.updateMenuItem), menuItemController.updateMenuItem);

router.delete('/:menuItemId', authenticate, authorize("ADMIN"),  validation(menuItemSchema.deleteMenuItem), menuItemController.deleteMenuItem);

export default router;