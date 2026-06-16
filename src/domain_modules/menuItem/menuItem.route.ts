import { Router } from 'express';
const router = Router({ mergeParams: true });
import * as menuItemController from './menuItem.controller';
import * as menuItemSchema from './menuItem.schema';
import { validation } from '../../middlewares/validation.middleware';
import { isAuthenticated } from '../../middlewares/authentication.middleware';
import { isAuthorized } from '../../middlewares/authorization.middleware';

router.post('/', isAuthenticated, isAuthorized("ADMIN"), validation(menuItemSchema.createMenuItem), menuItemController.createMenuItem);

router.get('/:menuItemId', validation(menuItemSchema.getMenuItemById), menuItemController.getMenuItemById);

router.get('/', validation(menuItemSchema.getMenuItemsByMenuId), menuItemController.getMenuItemsByMenuId);

router.put('/:menuItemId', isAuthenticated, isAuthorized("ADMIN"), validation(menuItemSchema.updateMenuItem), menuItemController.updateMenuItem);

router.delete('/:menuItemId', isAuthenticated, isAuthorized("ADMIN"),  validation(menuItemSchema.deleteMenuItem), menuItemController.deleteMenuItem);

export default router;