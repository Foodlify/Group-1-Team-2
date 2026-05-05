import { z } from "zod";


export const createOrderSchema = z.object({
  address :z.discriminatedUnion("type",[
    z.object({
      type: z.literal("existing"),
      addressId: z.number().int().positive()
    }),
    z.object({
    type: z.literal("new"),
  
        addressLine: z.string({ required_error: "addressLine is required" }).min(5),
        city: z.string({ required_error: "city is required" }).min(3),
        government: z.string({ required_error: "government is required" }).min(3),
        postalCode: z.string().min(4).optional(),
  
})
  ]),
      phone: z.string({ required_error: "phone is required" }).regex(/^01[0125][0-9]{8}$/, "phone must be a valid Egyptian number"),
    paymentMethod: z.enum(["CASH", "CARD"], { required_error: "paymentMethod is required" }),
    notes: z.string().optional(),
})