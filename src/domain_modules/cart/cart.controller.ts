import { Request, Response } from "express";
import * as cartService from "./cart.services";
import { asyncHandler } from "../../utils/asyncHandler";

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { menuItemId, quantity } = req.body;
  const userId = req.userId;

  const updatedCart = await cartService.addToCart(
    userId,
    menuItemId,
    quantity
  );

  res.status(201).json({
    message: "Item added to cart successfully",
    data: updatedCart,
  });
});


export const viewCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const cartData = await cartService.viewCart(userId);
  return res.status(200).json(cartData);
});

export const modifyCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { menuItemId, quantity } = req.body;

    const cart = await cartService.modifyCart(userId, menuItemId, quantity);

    return res.status(200).json({
        message: "Cart modified successfully",
        data: { cart }
    });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    const  menuItemId  = Number(req.params.menuItemId);

   const cart = await cartService.removeItem(userId, menuItemId);

    return res.status(200).json({
        message: "Item removed from cart successfully",
        data: { cart }
    });
   
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;

    const cart = await cartService.clearCart(userId);

    return res.status(200).json({
        message: "Cart cleared successfully",
        data: { cart }
    });
});
