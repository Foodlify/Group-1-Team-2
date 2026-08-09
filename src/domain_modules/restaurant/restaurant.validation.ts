import Zod from "zod";

export const createRestaurant = Zod.object({
  name: Zod.string().min(2).max(100),
  description: Zod.string().max(250).optional()
});