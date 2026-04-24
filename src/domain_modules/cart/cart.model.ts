type MenuItem = {
    id: number;
    menu_id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
};

type Cart = {
    id: number;
    user_id: number;
    items: CartItem[];
};

type CartItem = {
    id: number;
    cart_id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
    menuItem?: MenuItem;
};