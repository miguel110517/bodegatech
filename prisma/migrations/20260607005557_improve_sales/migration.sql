/*
  Warnings:

  - A unique constraint covering the columns `[invoice]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.
  - Made the column `invoice` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'TRANSFER', 'CARD', 'MIXED', 'CREDIT');

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "invoice" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_invoice_key" ON "Sale"("invoice");
