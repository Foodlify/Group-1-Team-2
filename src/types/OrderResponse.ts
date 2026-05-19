import { Prisma } from "@prisma/client";
export interface OrderResponse {
    customerId: number;
    totalPrice:  Prisma.Decimal;
    restaurantId: number;
    orderItems: {
        menuItemId: number;
        itemName: string;
        price: number;
        quantity: number;
        itemTotal:  Prisma.Decimal;
    }[];
    orderId: number;
    paymentUrl?: string;
}