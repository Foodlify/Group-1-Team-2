export const getAddressById = async (id: number, tx: any) => {
  return await tx.address.findUnique({
    where: { id }
  });
};