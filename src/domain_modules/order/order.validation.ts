import { z } from "zod";


export const createOrderSchema = z.object({
    addressId: z.number({required_error: "addressId is required"}).int().positive(),
    cartId: z.number({required_error: "cartId is required"}).int().positive() ,
    phone: z.string({ required_error: "phone is required" }).regex(/^01[0125][0-9]{8}$/, "phone must be a valid Egyptian number"),
    paymentMethod: z.enum(["CASH", "CARD"], { required_error: "paymentMethod is required" }),
    notes: z.string().optional(),
})

export const getOrderSchema = z.object({
        orderId: z.coerce.number().int().positive(),
});