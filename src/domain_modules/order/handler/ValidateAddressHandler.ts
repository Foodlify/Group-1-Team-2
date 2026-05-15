import prisma from "../../../lib/prisma";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { OrderHandler } from "./orderHandler";
import { AddressNotFoundOrNotOwnedException } from "../../../shared/exceptions/address.exception";

export class validateAddressHandler extends OrderHandler{
    async handle(request: OrderRequest, response: OrderResponse): Promise<OrderResponse> {
        const client = request.tx ?? prisma
        const address = await client.address.findUnique({where: {
            id: request.addressId,
            customerId: response.customerId
        } });
        if(!address){
            throw new AddressNotFoundOrNotOwnedException();
        }

            return this.handleNext(request, response);

    }

}
