import { AddressNotFoundOrNotOwnedException } from "../../shared/exceptions/address.exception";
import * as addressRepo from "./address.repository"
export const getCustomerAddressById = async (
    addressId: number,
    customerId: number,
    tx:any
)=>{
    const address = await addressRepo.getAddressById(addressId,tx);


  if (!address || address.customerId !== customerId) {
    throw new AddressNotFoundOrNotOwnedException();
  }

  return address;
}