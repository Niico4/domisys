/*
  Warnings:

  - The values [return] on the enum `MovementReason` will be removed. If these variants are still used in the database, this will fail.
  - The values [cancel] on the enum `OrderState` will be removed. If these variants are still used in the database, this will fail.
  - The values [inactive] on the enum `ProductState` will be removed. If these variants are still used in the database, this will fail.
  - The values [cancel] on the enum `SaleState` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updated_at` on the `access_code` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `access_code` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(32)`.
  - You are about to drop the column `updated_at` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `order_product` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `sale_product` table. All the data in the column will be lost.
  - You are about to drop the `delivery_rating` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `expires_at` on table `access_code` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reason` on table `inventory_movement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customer_id` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `price` to the `order_product` table without a default value. This is not possible if the table is not empty.
  - Made the column `cashier_id` on table `sale` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `price` to the `sale_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MovementReason_new" AS ENUM ('purchase', 'return_from_customer', 'replace_from_supplier', 'sale', 'expired', 'damaged_product', 'return_to_supplier', 'manual_error', 'inventory_count', 'other');
ALTER TABLE "inventory_movement" ALTER COLUMN "reason" TYPE "MovementReason_new" USING ("reason"::text::"MovementReason_new");
ALTER TYPE "MovementReason" RENAME TO "MovementReason_old";
ALTER TYPE "MovementReason_new" RENAME TO "MovementReason";
DROP TYPE "public"."MovementReason_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OrderState_new" AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
ALTER TABLE "public"."order" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "order" ALTER COLUMN "state" TYPE "OrderState_new" USING ("state"::text::"OrderState_new");
ALTER TYPE "OrderState" RENAME TO "OrderState_old";
ALTER TYPE "OrderState_new" RENAME TO "OrderState";
DROP TYPE "public"."OrderState_old";
ALTER TABLE "order" ALTER COLUMN "state" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductState_new" AS ENUM ('active', 'disabled', 'out_of_stock', 'expired');
ALTER TABLE "public"."product" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "product" ALTER COLUMN "state" TYPE "ProductState_new" USING ("state"::text::"ProductState_new");
ALTER TYPE "ProductState" RENAME TO "ProductState_old";
ALTER TYPE "ProductState_new" RENAME TO "ProductState";
DROP TYPE "public"."ProductState_old";
ALTER TABLE "product" ALTER COLUMN "state" SET DEFAULT 'active';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SaleState_new" AS ENUM ('sold', 'cancelled');
ALTER TABLE "public"."sale" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "sale" ALTER COLUMN "state" TYPE "SaleState_new" USING ("state"::text::"SaleState_new");
ALTER TYPE "SaleState" RENAME TO "SaleState_old";
ALTER TYPE "SaleState_new" RENAME TO "SaleState";
DROP TYPE "public"."SaleState_old";
ALTER TABLE "sale" ALTER COLUMN "state" SET DEFAULT 'sold';
COMMIT;

-- DropForeignKey
ALTER TABLE "access_code" DROP CONSTRAINT "access_code_created_by_fkey";

-- DropForeignKey
ALTER TABLE "delivery_rating" DROP CONSTRAINT "delivery_rating_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_rating" DROP CONSTRAINT "delivery_rating_order_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_movement" DROP CONSTRAINT "inventory_movement_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_movement" DROP CONSTRAINT "inventory_movement_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "sale" DROP CONSTRAINT "sale_cashier_id_fkey";

-- DropIndex
DROP INDEX "access_code_status_idx";

-- DropIndex
DROP INDEX "order_created_at_idx";

-- DropIndex
DROP INDEX "user_last_name_idx";

-- DropIndex
DROP INDEX "user_name_idx";

-- AlterTable
ALTER TABLE "access_code" DROP COLUMN "updated_at",
ADD COLUMN     "disabled_at" TIMESTAMP(6),
ADD COLUMN     "disabled_by" INTEGER,
ADD COLUMN     "used_at" TIMESTAMP(6),
ADD COLUMN     "used_by" INTEGER,
ALTER COLUMN "code" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "expires_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "address" ALTER COLUMN "street" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "inventory_movement" ADD COLUMN     "provider_id" INTEGER,
ALTER COLUMN "reason" SET NOT NULL,
ALTER COLUMN "admin_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "updated_at",
ADD COLUMN     "cancelled_at" TIMESTAMP(6),
ADD COLUMN     "confirmed_at" TIMESTAMP(6),
ADD COLUMN     "delivered_at" TIMESTAMP(6),
ADD COLUMN     "shipped_at" TIMESTAMP(6),
ALTER COLUMN "customer_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "order_product" DROP COLUMN "unit_price",
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "measure" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "lot" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "provider" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "sale" ADD COLUMN     "cancelled_at" TIMESTAMP(6),
ALTER COLUMN "cashier_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "sale_product" DROP COLUMN "unit_price",
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "delivery_rating";

-- CreateIndex
CREATE INDEX "access_code_status_created_at_idx" ON "access_code"("status", "created_at");

-- CreateIndex
CREATE INDEX "access_code_created_by_idx" ON "access_code"("created_by");

-- CreateIndex
CREATE INDEX "access_code_used_by_idx" ON "access_code"("used_by");

-- CreateIndex
CREATE INDEX "address_user_id_idx" ON "address"("user_id");

-- CreateIndex
CREATE INDEX "address_city_neighborhood_idx" ON "address"("city", "neighborhood");

-- CreateIndex
CREATE INDEX "movement_product_id_idx" ON "inventory_movement"("product_id");

-- CreateIndex
CREATE INDEX "movement_admin_id_idx" ON "inventory_movement"("admin_id");

-- CreateIndex
CREATE INDEX "movement_provider_id_idx" ON "inventory_movement"("provider_id");

-- CreateIndex
CREATE INDEX "movement_type_reason_idx" ON "inventory_movement"("movement_type", "reason");

-- CreateIndex
CREATE INDEX "order_customer_id_idx" ON "order"("customer_id");

-- CreateIndex
CREATE INDEX "order_delivery_id_idx" ON "order"("delivery_id");

-- CreateIndex
CREATE INDEX "order_state_created_at_idx" ON "order"("state", "created_at");

-- CreateIndex
CREATE INDEX "order_state_payment_method_idx" ON "order"("state", "payment_method");

-- CreateIndex
CREATE INDEX "order_delivered_at_idx" ON "order"("delivered_at");

-- CreateIndex
CREATE INDEX "product_state_idx" ON "product"("state");

-- CreateIndex
CREATE INDEX "provider_nit_name_idx" ON "provider"("nit", "name");

-- CreateIndex
CREATE INDEX "sale_state_idx" ON "sale"("state");

-- CreateIndex
CREATE INDEX "sale_cancelled_at_idx" ON "sale"("cancelled_at");

-- CreateIndex
CREATE INDEX "sale_state_created_at_idx" ON "sale"("state", "created_at");

-- CreateIndex
CREATE INDEX "sale_payment_method_idx" ON "sale"("payment_method");

-- CreateIndex
CREATE INDEX "user_full_name_idx" ON "user"("name", "last_name");

-- AddForeignKey
ALTER TABLE "access_code" ADD CONSTRAINT "access_code_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_code" ADD CONSTRAINT "access_code_disabled_by_fkey" FOREIGN KEY ("disabled_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_code" ADD CONSTRAINT "access_code_used_by_fkey" FOREIGN KEY ("used_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "inventory_movement_created_at_idx" RENAME TO "movement_created_at_idx";

-- RenameIndex
ALTER INDEX "inventory_movement_movement_type_idx" RENAME TO "movement_type_idx";

-- RenameIndex
ALTER INDEX "inventory_movement_reason_idx" RENAME TO "movement_reason_idx";

-- RenameIndex
ALTER INDEX "product_category_id_provider_id_idx" RENAME TO "product_category_provider_id_idx";
