import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import * as orderService from "./order.services";
import { sendSucess,sendError } from "../../utils/response";
import { StatusCodes} from 'http-status-codes';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId as number;
   const body = req.body;

   const order = await orderService.createOrderService(userId, body);

   sendSucess(res, {
     message: "Order placed successfully",
     statusCode: StatusCodes.CREATED,
     data: order
   })
});


export const viewOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId as number;

  const orders = await orderService.getAllOrders(userId);

  sendSucess(res, { statusCode: StatusCodes.OK, data: orders });
});

export const viewOrder = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId as number;
   const orderId = Number(req.params.orderId);

   const order = await orderService.getOrderById(userId, orderId);

   sendSucess(res, { statusCode: StatusCodes.OK, data: order });
});
