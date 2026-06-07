import  z from "zod";

export const createMenuItem = z.object({
    menuId: z.string().refine((val) => !isNaN(Number(val)), {
        message: " menuId is required and must be a number ",
    }),
    itemName: z.string().min(1, "Item name is required"),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),

});

export const getMenuItemById = z.object({
    menuItemId: z.string().refine((val) => !isNaN(Number(val)), {
        message: "id is required and must be a number",
    }),
    menuId: z.string().refine((val) => !isNaN(Number(val)), {
        message: "menuId is required and must be a number",
    }),
});

export const getMenuItemsByMenuId = z.object({
    menuId: z.string().refine((val) => !isNaN(Number(val)), {
        message: "menuId is required and must be a number",
    }),

});

export const updateMenuItem = z.object({
    menuId: z.string().refine((val) => !isNaN(Number(val)), {
        message: "menuId is required and must be a number",
    }),
    menuItemId: z.string().refine((val) => !isNaN(Number(val)), {
        message: "menuItemId is required and must be a number",
    }),
        itemName: z.string().min(1, "Item name is required").optional(),
        price: z.number().positive("Price must be a positive number").optional(),
        stock: z.number().int().nonnegative("Stock must be a non-negative integer").optional(),
});

export const deleteMenuItem = z.object({
    menuId: z.string().refine((val) => !isNaN(Number(val)), {
        message: "menuId is required and must be a number",
    }),
    menuItemId: z.string().refine((val) => !isNaN(Number(val)), {
        message: "menuItemId is required and must be a number",
    }),
    
});





