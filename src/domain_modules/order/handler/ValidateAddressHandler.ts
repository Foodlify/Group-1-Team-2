import prisma from "../../../lib/prisma";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { OrderHandler } from "./orderHandler";
import { AddressNotFoundOrNotOwnedException } from "../../../shared/exceptions/address.exception";
import * as addressRepo from "../../address/address.repository";

export class validateAddressHandler extends OrderHandler{
    async handle(request: OrderRequest, response: OrderResponse): Promise<OrderResponse> {
        const client = request.tx ?? prisma

        const address = await addressRepo.getAddressById(request.addressId,client);
        if(!address){
            throw new AddressNotFoundOrNotOwnedException();
          }
        response.addressId = address.id;

        return this.handleNext(request, response);

    }

}
