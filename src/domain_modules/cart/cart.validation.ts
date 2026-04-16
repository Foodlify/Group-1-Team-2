import { z } from "zod";

export const addToCartSchema = z.object({
  menuItemId: z
    .number({ required_error: "menuItemId is required" })
    .int("menuItemId must be an integer")
    .positive("menuItemId must be a positive number"),

  quantity: z
    .number({ required_error: "quantity is required" })
    .int("quantity must be an integer")
    .positive("quantity must be at least 1"),
});


export const modifyCartSchema = z.object({
  menuItemId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const clearCartSchema = z.object({
});
