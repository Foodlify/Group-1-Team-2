import { OrderRequest } from "../../types/OrderRequest";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import * as OrderServices from "./order.services";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const request: OrderRequest = {
    userId: req.userId as string,
    cartId: req.body.cartId,
    addressId: req.body.addressId,
    phone: req.body.phone,
    notes: req.body.notes,
    paymentMethod: req.body.paymentMethod,
  };

  const response = await OrderServices.createOrder(request);

  sendSucess(res, {
    message: "Order created successfully",
    statusCode: StatusCodes.CREATED,
    data: response,
  });
});


export const viewOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId as string;

  const orders = await OrderServices.getAllOrders(userId);

  sendSucess(res, { statusCode: StatusCodes.OK, data: orders });
});

export const viewOrder = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId as string;
   const orderId = Number(req.params.orderId);

   const order = await OrderServices.getOrderById(userId, orderId);

   sendSucess(res, { statusCode: StatusCodes.OK, data: order });
});
