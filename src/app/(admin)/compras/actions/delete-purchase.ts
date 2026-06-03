"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePurchase(id: string) {
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

  await prisma.purchase.delete({
    where: {
      id,
    },
  });

  revalidatePath("/compras");
  revalidatePath("/productos");
}