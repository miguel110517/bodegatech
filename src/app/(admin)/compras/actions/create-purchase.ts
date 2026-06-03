"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPurchase(formData: FormData) {
  const invoice =
    formData.get("invoice")?.toString() || null;

  const providerId =
    formData.get("providerId")?.toString() || "";

  const productId =
    formData.getAll("productId") as string[];

  const quantity =
    formData.getAll("quantity") as string[];

  const costPrice =
    formData.getAll("costPrice") as string[];

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
      },
    });
  }

  revalidatePath("/compras");
  revalidatePath("/productos");
}