
import { MenuItemResponseDto } from './menuItem'
import { toMenuItemDto } from './menuItem'
export interface MenuResponseDto {
  id: number;
  restaurantId: number;
  menuItems: MenuItemResponseDto[];
}

export const toMenuDto = (menu: {
  id: number;
  restaurantId: number;
  menuItems: Parameters<typeof toMenuItemDto>[0][];
}): MenuResponseDto => ({
  id: menu.id,
  restaurantId: menu.restaurantId,
  menuItems: menu.menuItems.map(toMenuItemDto),
});
