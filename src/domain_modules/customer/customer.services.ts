import * as customerRepo from "./customer.repository"
import {CustomerNotFound} from "../../shared/exceptions/Customer.exception"


export const getCustomerByUserId = async (userId: number) => {  
    const customer = await customerRepo.getCustomerByUserId(userId)

    if (!customer) throw new CustomerNotFound(userId.toString())

    return customer
}