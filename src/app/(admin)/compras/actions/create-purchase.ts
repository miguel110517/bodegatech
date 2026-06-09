"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPurchase(formData: FormData) {
  const providerId =
    formData.get("providerId")?.toString() || "";

  const productId =
    formData.getAll("productId") as string[];

  const quantity =
    formData.getAll("quantity") as string[];

  const costPrice =
    formData.getAll("costPrice") as string[];

  const compras = await prisma.purchase.findMany({
    select: {
      invoice: true,
    },
  });

  let mayorNumero = 0;

  for (const compra of compras) {
    if (!compra.invoice?.startsWith("COM-")) continue;

    const numero = parseInt(
      compra.invoice.replace("COM-", "")
    );

    if (!isNaN(numero) && numero > mayorNumero) {
      mayorNumero = numero;
    }
  }

  const invoice = `COM-${String(
    mayorNumero + 1
  ).padStart(4, "0")}`;

  const purchase = await prisma.purchase.create({
    data: {
      invoice,
      providerId,
    },
  });

  for (let i = 0; i < productId.length; i++) {
    const qty = Number(quantity[i]);
    const cost = Number(costPrice[i]);

    await prisma.purchaseItem.create({
      data: {
        purchaseId: purchase.id,
        productId: productId[i],
        quantity: qty,
        costPrice: cost,
      },
    });

    await prisma.product.update({
      where: {
        id: productId[i],
      },
      data: {
        stock: {
          increment: qty,
        },
        costPrice: cost,
      },
    });
  }

  revalidatePath("/compras");
  revalidatePath("/productos");

  
}

