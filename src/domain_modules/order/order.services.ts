import * as CustomerServices from "../customer/customer.services";
import * as CartServices from "../cart/cart.services";
import * as orderRepo from "../order/order.repository";
import * as AddressServices from "../address/address.service";
import { CartNotFoundExeption } from "../../shared/exceptions/Cart.exception";
import { checkMenuItemsExistAndStock } from "./order.helpers";
import prisma from "../../lib/prisma";

export const createOrderService = async (userId: number, body: any) => {
    
    const customer = await CustomerServices.getCustomerByUserId(userId);

    const cart = await CartServices.viewCart(userId);
    console.log(cart);
    if (!cart || !cart.items.length) {
        throw new CartNotFoundExeption();
    }

    const orderId = await prisma.$transaction(async (tx) => {

        // 4.1 تحقق من الـ stock
        const menuItemMap = await checkMenuItemsExistAndStock(cart.items, tx);

        // 4.2 جيب أو إنشاء الـ address
        let addressId: number;

        if (body.address.type === "existing") {
            const address = await AddressServices.getCustomerAddressById(body.address.addressId, customer.id, tx);
            addressId = address.id;
        } else {
            const { type, ...addressData } = body.address;
            const newAddress = await orderRepo.createAddress({ customerId: customer.id, ...addressData }, tx);
            addressId = newAddress.id;
        }

        // 4.3 إنشاء الـ Order
        const order = await orderRepo.createOrder({
            customerId: customer.id,
            restaurantId: cart.restaurantId,
            addressId,
            phone: body.phone,
            totalPrice: cart.totalPrice,
            paymentMethod: body.paymentMethod,
            notes: body.notes,
        }, tx);

        // 4.4 إنشاء الـ OrderItems
        const orderItems = cart.items.map((item: any) => {
            const menuItem = menuItemMap.get(item.productId);
            return {
                orderId: order.id,
                menuItemId: item.productId,
                itemName: menuItem!.itemName,
                price: menuItem!.price,
                quantity: item.quantity,
                itemTotal: item.itemTotal,
            };
        });
        await orderRepo.createOrderItems(orderItems, tx);

        // 4.5 قلل الـ stock
        await orderRepo.updateMenuItemStock(
            orderItems.map((item: any) => ({ id: item.menuItemId, quantity: item.quantity })),
            tx
        );

        // 4.6 قفل الـ cart
        await CartServices.lockCart(cart.id, tx);

        return order.id; // ← التغيير الوحيد
    });

    return await orderRepo.getOrderById(orderId);
};