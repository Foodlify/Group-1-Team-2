import { Decimal } from "@prisma/client/runtime/library";
export type MenuItem = {
    id: number;
    menuId: number;
    itemName: string;
    price: Decimal;
    stock: number;
};

export type Cart = {
    id: number;
    customerId: number;
    restaurantId: number;
    status: boolean;
    createdAt: Date;
    cartItems: CartItem[];
};

export type CartItem = {
    id: number;
    cartId: number;
    menuItemId: number;
    quantity: number;
    price: Decimal;
    menuItem?: MenuItem;
};