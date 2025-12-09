/*
  Warnings:

  - Added the required column `address_id` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "address_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "order_address_id_idx" ON "order"("address_id");

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
