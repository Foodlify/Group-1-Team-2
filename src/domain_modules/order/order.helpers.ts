import * as orderRepo from "../order/order.repository";
import { MenuItemNotFoundException, StockNotEnoughException } from "../../shared/exceptions/MenuItem.exception";


export const checkMenuItemsExistAndStock = async (cartItems: any[], tx: any) => {
    const menuItemIds = cartItems.map(item => item.productId);
    const menuItems = await orderRepo.getMenuItemsByIds(menuItemIds, tx);
    const menuItemMap = new Map(menuItems.map(item => [item.id, item]));

    for (const item of cartItems) {
        const menuItem = menuItemMap.get(item.productId);
        if (!menuItem) throw new MenuItemNotFoundException(item.productId);
        if (menuItem.stock < item.quantity) throw new StockNotEnoughException(item.productId, menuItem.stock);
    }
    
    return menuItemMap; 
}