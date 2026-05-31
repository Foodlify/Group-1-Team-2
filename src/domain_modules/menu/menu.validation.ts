import z from "zod";

export const createMenu = z.object({
  restaurantId: z.number().int().positive()
});
