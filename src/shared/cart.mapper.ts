export const buildCartResponse = (cart: any) => {
  const formattedItems = cart.items.map((item: any) => ({
    itemId: item.id,
    productId: item.menuItem.id,
    name: item.menuItem.name,
    price: item.menuItem.price,
    quantity: item.quantity,
    itemTotal: item.quantity * item.menuItem.price,
  }));

  const totalPrice = formattedItems.reduce(
    (acc: number, item: any) => acc + item.itemTotal,
    0
  );

  return {
    cartId: cart.id,
    status: cart.status,
    items: formattedItems,
    totalPrice,
    itemCount: formattedItems.length,
  };
};