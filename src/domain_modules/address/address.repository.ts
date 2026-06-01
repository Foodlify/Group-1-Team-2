import prisma from "../../lib/prisma";
import { DBClient } from "../../types/PrismaClientOrTx";

export const getAddressById = async (id: number, client:DBClient = prisma) => {
  return await client.address.findUnique({
    where: { id }
  });
};