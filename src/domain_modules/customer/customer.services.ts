import * as customerRepo from "./customer.repository"
import {CustomerNotFound} from "../../shared/exceptions/Customer.exception"


export const getCustomerByUserId = async (userId: number) => {  
    const customer = await customerRepo.getCustomerProfileByUserId(userId)

    if (!customer) throw new CustomerNotFound(userId.toString())

    return customer
}

export const updateCustomerProfile = async (userId: number, { name, email, phone }: { name?: string; email?: string; phone?: string }) => {
    const customer = await customerRepo.getCustomerProfileByUserId(userId)
    if (!customer) throw new CustomerNotFound(userId.toString())
      const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

  const updatedUser = await customerRepo.updateUser(userId, updateData);

  return updatedUser

}