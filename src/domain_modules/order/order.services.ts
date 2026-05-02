import * as orderRepo from "./order.repository";
import * as orderExceptions from "../../shared/exceptions/Order.exception";


export const getAllOrders = async (userId: number) => {
    return await orderRepo.findAllOrdersByUserId(userId);
};

export const getOrderById = async (userId: number, orderId: number) => {
    const order = await orderRepo.findOrderByIdAndUserId(orderId, userId);
    if (!order) {
        throw new orderExceptions.OrderNotFoundException();
    }
    return order;
};