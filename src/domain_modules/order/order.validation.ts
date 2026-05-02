import { z } from "zod";

export const getOrderSchema = z.object({
        orderId: z.coerce.number().int().positive(),
});