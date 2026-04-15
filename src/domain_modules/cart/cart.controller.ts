import { Request, Response, NextFunction } from "express";
import * as cartService from "./cart.services";

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuItemId, quantity } = req.body;

    // Hardcode a userId for now until authentication is implemented
    const userId = 1;

    const updatedCart = await cartService.addToCart(
      userId,
      menuItemId,
      quantity
    );

    res.status(201).json({
      message: "Item added to cart successfully",
      data: updatedCart,
    });
  } catch (error: any) {
    if (
      error.message === "Product not found" ||
      error.message === "Not enough product stock available"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    next(error);
  }
};
