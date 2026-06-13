"use server";

import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createSale(formData: FormData) {
  const customerId = formData.get("customerId")?.toString() || "";

  const paymentMethod = formData.get("paymentMethod")?.toString() || "CASH";

  const discount = Number(formData.get("discount") || 0);

  const notes = formData.get("notes")?.toString() || "";

  const cashAmount = Number(formData.get("cashAmount") || 0);

  const transferAmount = Number(formData.get("transferAmount") || 0);

  const cardAmount = Number(formData.get("cardAmount") || 0);

  const creditAmount = Number(formData.get("creditAmount") || 0);

  const dueDate = formData.get("dueDate")?.toString() || null;

  if (
    cashAmount < 0 ||
    transferAmount < 0 ||
    cardAmount < 0 ||
    creditAmount < 0
  ) {
    throw new Error("Los montos de pago no pueden ser negativos");
  }

  const productId = formData.getAll("productId") as string[];

  const quantity = formData.getAll("quantity") as string[];

  if (!customerId) {
    throw new Error("Debe seleccionar un cliente");
  }

  if (productId.length === 0) {
    throw new Error("Debe agregar al menos un producto");
  }

  const lastSale = await prisma.sale.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  let nextNumber = 1;

  if (lastSale?.invoice) {
    const currentNumber = Number(lastSale.invoice.replace("VEN-", ""));

    nextNumber = currentNumber + 1;
  }

  const invoice = `VEN-${String(nextNumber).padStart(6, "0")}`;

  let subtotal = 0;

  const products = [];

  for (let i = 0; i < productId.length; i++) {
    const qty = Number(quantity[i]);

    const product = await prisma.product.findUnique({
      where: {
        id: productId[i],
      },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (product.stock < qty) {
      throw new Error(`Stock insuficiente para ${product.name}`);
    }

    const realSalePrice = product.offerPrice ?? product.salePrice;

    subtotal += qty * realSalePrice;

    products.push({
      product,
      qty,
      realSalePrice,
    });
  }

  const total = subtotal - discount;

  let finalCashAmount = cashAmount;
  let finalTransferAmount = transferAmount;
  let finalCardAmount = cardAmount;
  let finalCreditAmount = creditAmount;

  if (paymentMethod === "CASH") {
    finalCashAmount = total;
  }

  if (paymentMethod === "TRANSFER") {
    finalTransferAmount = total;
  }

  if (paymentMethod === "CARD") {
    finalCardAmount = total;
  }

  if (paymentMethod === "CREDIT") {
    finalCreditAmount = total;
  }

  const totalPagado =
    finalCashAmount + finalTransferAmount + finalCardAmount + finalCreditAmount;

  if (totalPagado !== total) {
    throw new Error(
      "La suma de los métodos de pago debe ser igual al total de la venta",
    );
  }

  if (finalCreditAmount > 0 && !dueDate) {
    throw new Error("Debe seleccionar una fecha límite para el crédito");
  }

  await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({
      data: {
        invoice,
        customerId,

        subtotal,
        discount,
        total,

        notes,

        paymentMethod: paymentMethod as PaymentMethod,

        cashAmount: finalCashAmount,
        transferAmount: finalTransferAmount,
        cardAmount: finalCardAmount,
        creditAmount: finalCreditAmount,
      },
    });

    for (const item of products) {
      await tx.saleItem.create({
        data: {
          saleId: sale.id,

          productId: item.product.id,

          quantity: item.qty,

          costPrice: item.product.costPrice,

          salePrice: item.realSalePrice,
        },
      });

      await tx.product.update({
        where: {
          id: item.product.id,
        },
        data: {
          stock: {
            decrement: item.qty,
          },
        },
      });
    }

    if (finalCreditAmount > 0) {
      await tx.accountReceivable.create({
        data: {
          saleId: sale.id,

          totalAmount: finalCreditAmount,

          paidAmount: 0,

          pendingAmount: finalCreditAmount,

          dueDate: new Date(dueDate!),

          status: "PENDING",
        },
      });
    }
  });
  revalidatePath("/ventas");
  revalidatePath("/cuentas-por-cobrar");
  revalidatePath("/productos");
}
