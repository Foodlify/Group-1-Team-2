import prisma from "../../../lib/prisma";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { OrderHandler } from "./orderHandler";
import { CustomerNotFound } from "../../../shared/exceptions/Customer.exception";
import * as customerRepo from "../../customer/customer.repository";

export class ValidateCustomerExistHandler extends OrderHandler {
    
    async handle(request: OrderRequest, response: OrderResponse): Promise<OrderResponse> {
        
        const client = request.tx ?? prisma
        const customer = await customerRepo.getCustomerProfileByUserId(request.userId, client);
        
        if (!customer) {
            throw new CustomerNotFound(request.userId.toString());
        }
        

        response.customerId = customer.id;

        return this.handleNext(request, response);
    }
}