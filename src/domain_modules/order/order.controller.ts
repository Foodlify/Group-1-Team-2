import { Request, Response } from "express";
import * as orderService from "./order.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

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
