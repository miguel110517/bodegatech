"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePurchase(
  id: string,
  formData: FormData
) {
  const invoice =
    formData.get("invoice")?.toString() || null;

  const providerId =
    formData.get("providerId")?.toString() || "";

  const purchase = await prisma.purchase.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!purchase) return;

  for (const item of purchase.items) {
    await prisma.product.update({
      where: {
        id: item.productId,
      },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  await prisma.purchaseItem.deleteMany({
    where: {
      purchaseId: id,
    },
  });

  const productId =
    formData.getAll("productId") as string[];

  const quantity =
    formData.getAll("quantity") as string[];

  const costPrice =
    formData.getAll("costPrice") as string[];

  for (let i = 0; i < productId.length; i++) {
    const qty = Number(quantity[i]);
    const cost = Number(costPrice[i]);

    await prisma.purchaseItem.create({
      data: {
        purchaseId: id,
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

  await prisma.purchase.update({
    where: {
      id,
    },
    data: {
      invoice,
      providerId,
    },
  });

  revalidatePath("/compras");
  revalidatePath("/productos");
}