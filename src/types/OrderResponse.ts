import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
export interface OrderResponse {
    customerId: number;
    totalPrice:  Prisma.Decimal;
    restaurantId: number;
    orderItems: {
        menuItemId: number;
        itemName: string;
        price: Decimal;
        quantity: number;
        itemTotal:  Prisma.Decimal;
    }[];
    orderId: number;
    paymentUrl?: string;
    addressId: number
}