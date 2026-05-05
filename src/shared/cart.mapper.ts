export const buildCartResponse = (cart: any) => {
  const formattedItems = cart.cartItems.map((item: any) => ({
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
   ...cart,
    items: formattedItems,
    totalPrice,
    itemCount: formattedItems.length,
  };
};