import z from "zod";

export const createMenu = z.object({
  restaurantId: z.string().refine((val) => !isNaN(Number(val)), {
    message: "restaurantId must be a number",
  }),
});

export const getMenus = z.object({
    restaurantId: z.string().refine((val) => !isNaN(Number(val)), {
      message: "restaurantId must be a number",
    })
});
