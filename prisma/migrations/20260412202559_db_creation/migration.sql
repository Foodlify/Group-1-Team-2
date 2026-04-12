-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('active', 'checked_out');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'success', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "building_no" TEXT,
    "city" TEXT NOT NULL,
    "governorate" TEXT NOT NULL,
    "postal_code" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "contact_phone" TEXT,
    "address" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "CartStatus" NOT NULL,
    "discount_id" INTEGER,
    "total_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "order_status_id" INTEGER NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "payment_status_id" INTEGER NOT NULL,
    "shipping_fee" DOUBLE PRECISION NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PaymentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "provider_transaction_id" TEXT,
    "status" "TransactionStatus" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "old_status" TEXT NOT NULL,
    "new_status" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Cart_user_id_idx" ON "Cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cart_id_menu_item_id_key" ON "CartItem"("cart_id", "menu_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_cart_id_key" ON "Order"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderStatus_name_key" ON "OrderStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "PaymentMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentStatus_name_key" ON "PaymentStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_provider_transaction_id_key" ON "Transaction"("provider_transaction_id");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "DiscountCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_order_status_id_fkey" FOREIGN KEY ("order_status_id") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_status_id_fkey" FOREIGN KEY ("payment_status_id") REFERENCES "PaymentStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
