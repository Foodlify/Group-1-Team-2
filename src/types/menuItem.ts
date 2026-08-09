export interface UpdateMenuItem {
    itemName?: string; 
    price?: number;
    stock?: number;
}

export interface MenuItemResponseDto {
  id: number;
  menuId: number;
  itemName: string;
  price: number;   // Decimal من Prisma بنحوله لـ number
  stock: number;
}

// -------- Mapper Functions --------
export const toMenuItemDto = (item: {
  id: number;
  menuId: number;
  itemName: string;
  price: { toNumber(): number } | number;
  stock: number;
}): MenuItemResponseDto => ({
  id: item.id,
  menuId: item.menuId,
  itemName: item.itemName,
  price: typeof item.price === "number" ? item.price : item.price.toNumber(),
  stock: item.stock,
});

 