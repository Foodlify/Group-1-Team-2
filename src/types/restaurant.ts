// dto/restaurant.ts
import { MenuResponseDto } from './menu';
import { toMenuDto } from './menu';

export interface RestaurantResponseDto {
  id: number;
  name: string;
  menus: MenuResponseDto[];
}

export const toRestaurantDto = (restaurant: {
  id: number;
  name: string;
  menus: Parameters<typeof toMenuDto>[0][];
}): RestaurantResponseDto => ({
  id: restaurant.id,
  name: restaurant.name,
  menus: restaurant.menus.map(toMenuDto),
});

export interface createRestaurantDto {
    name: string;
}


export interface updateRestaurantDto {
    name?: string;
}
