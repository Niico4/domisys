-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'customer', 'cashier', 'delivery');

-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancel');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('nequi', 'daviplata', 'cash', 'credit_card');

-- CreateEnum
CREATE TYPE "SaleState" AS ENUM ('sold', 'cancel');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('in', 'out', 'adjustment');

-- CreateEnum
CREATE TYPE "MovementReason" AS ENUM ('expired', 'return_to_supplier', 'sale', 'manual_error', 'damaged_product', 'return', 'other');

-- CreateEnum
CREATE TYPE "ProductState" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "AccessCodeRole" AS ENUM ('admin', 'delivery', 'cashier');

-- CreateEnum
CREATE TYPE "AccessCodeState" AS ENUM ('active', 'used', 'expired', 'disabled');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'customer',
    "username" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_code" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "role" "AccessCodeRole" NOT NULL,
    "status" "AccessCodeState" NOT NULL DEFAULT 'active',
    "expires_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "access_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "state" "OrderState" NOT NULL DEFAULT 'pending',
    "payment_method" "PaymentMethod" NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "customer_id" INTEGER,
    "delivery_id" INTEGER,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "alias" VARCHAR(100) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "neighborhood" VARCHAR(50) NOT NULL,
    "street" VARCHAR(50) NOT NULL,
    "details" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nit" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "contact_number" VARCHAR(20) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "measure" VARCHAR(20) NOT NULL,
    "lot" VARCHAR(15) NOT NULL,
    "expiration_date" DATE,
    "image" VARCHAR(200),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "state" "ProductState" NOT NULL DEFAULT 'active',
    "provider_id" INTEGER,
    "category_id" INTEGER,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale" (
    "id" SERIAL NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "state" "SaleState" NOT NULL DEFAULT 'sold',
    "total_amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cashier_id" INTEGER,

    CONSTRAINT "sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_product" (
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sale_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "sale_product_pkey" PRIMARY KEY ("sale_id","product_id")
);

-- CreateTable
CREATE TABLE "order_product" (
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "order_product_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "inventory_movement" (
    "id" SERIAL NOT NULL,
    "movement_type" "MovementType" NOT NULL,
    "reason" "MovementReason",
    "quantity" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,

    CONSTRAINT "inventory_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_rating" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "delivery_rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "user_name_idx" ON "user"("name");

-- CreateIndex
CREATE INDEX "user_last_name_idx" ON "user"("last_name");

-- CreateIndex
CREATE UNIQUE INDEX "access_code_code_key" ON "access_code"("code");

-- CreateIndex
CREATE INDEX "access_code_role_idx" ON "access_code"("role");

-- CreateIndex
CREATE INDEX "access_code_status_idx" ON "access_code"("status");

-- CreateIndex
CREATE INDEX "order_state_idx" ON "order"("state");

-- CreateIndex
CREATE INDEX "order_payment_method_idx" ON "order"("payment_method");

-- CreateIndex
CREATE INDEX "order_created_at_idx" ON "order"("created_at");

-- CreateIndex
CREATE INDEX "address_alias_idx" ON "address"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "provider_nit_key" ON "provider"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "provider_email_key" ON "provider"("email");

-- CreateIndex
CREATE INDEX "provider_name_idx" ON "provider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE INDEX "product_provider_id_idx" ON "product"("provider_id");

-- CreateIndex
CREATE INDEX "product_name_idx" ON "product"("name");

-- CreateIndex
CREATE INDEX "product_expiration_date_idx" ON "product"("expiration_date");

-- CreateIndex
CREATE INDEX "product_category_id_idx" ON "product"("category_id");

-- CreateIndex
CREATE INDEX "product_category_id_provider_id_idx" ON "product"("category_id", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_name_lot_measure_key" ON "product"("name", "lot", "measure");

-- CreateIndex
CREATE INDEX "sale_cashier_id_idx" ON "sale"("cashier_id");

-- CreateIndex
CREATE INDEX "sale_created_at_idx" ON "sale"("created_at");

-- CreateIndex
CREATE INDEX "inventory_movement_movement_type_idx" ON "inventory_movement"("movement_type");

-- CreateIndex
CREATE INDEX "inventory_movement_reason_idx" ON "inventory_movement"("reason");

-- CreateIndex
CREATE INDEX "inventory_movement_created_at_idx" ON "inventory_movement"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_rating_order_id_customer_id_key" ON "delivery_rating"("order_id", "customer_id");

-- AddForeignKey
ALTER TABLE "access_code" ADD CONSTRAINT "access_code_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_product" ADD CONSTRAINT "sale_product_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_product" ADD CONSTRAINT "sale_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_rating" ADD CONSTRAINT "delivery_rating_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_rating" ADD CONSTRAINT "delivery_rating_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
