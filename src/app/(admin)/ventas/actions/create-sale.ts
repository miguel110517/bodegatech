"use server";

import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createSale(formData: FormData) {
  const customerId = formData.get("customerId")?.toString() || "";

  const paymentMethod = formData.get("paymentMethod")?.toString() || "CASH";

  const discount = Number(formData.get("discount") || 0);

  const notes = formData.get("notes")?.toString() || "";

  const productId = formData.getAll("productId") as string[];

  const quantity = formData.getAll("quantity") as string[];

  if (!customerId) {
    throw new Error("Debe seleccionar un cliente");
  }

  if (productId.length === 0) {
    throw new Error("Debe agregar al menos un producto");
  }

  // FACTURA AUTOMÁTICA

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

  const sale = await prisma.sale.create({
    data: {
      invoice,
      customerId,

      subtotal: 0,
      discount,
      total: 0,
      notes,

      paymentMethod: paymentMethod as PaymentMethod,
    },
  });

  let subtotal = 0;

  for (let i = 0; i < productId.length; i++) {
    const qty = Number(quantity[i]);

    const product = await prisma.product.findUnique({
      where: {
        id: productId[i],
      },
    });

    if (!product) continue;

    if (product.stock < qty) {
      throw new Error(`Stock insuficiente para ${product.name}`);
    }

    const realSalePrice = product.offerPrice ?? product.salePrice;

    subtotal += qty * realSalePrice;

    await prisma.saleItem.create({
      data: {
        saleId: sale.id,
        productId: product.id,
        quantity: qty,

        costPrice: product.costPrice,

        salePrice: realSalePrice,
      },
    });

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        stock: {
          decrement: qty,
        },
      },
    });
  }

  const total = subtotal - discount;

  await prisma.sale.update({
    where: {
      id: sale.id,
    },
    data: {
      subtotal,
      discount,
      total,
      notes,

      paymentMethod: paymentMethod as PaymentMethod,
    },
  });

  if (paymentMethod === "CREDIT") {
    await prisma.accountReceivable.create({
      data: {
        saleId: sale.id,

        totalAmount: total,

        paidAmount: 0,

        pendingAmount: total,

        status: "PENDING",
      },
    });
  }

  revalidatePath("/ventas");
  revalidatePath("/productos");
}
