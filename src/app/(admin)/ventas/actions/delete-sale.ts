"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSale(id: string) {
  const sale = await prisma.sale.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!sale) {
    return;
  }

  for (const item of sale.items) {
    await prisma.product.update({
      where: {
        id: item.productId,
      },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
    });
  }

  await prisma.saleItem.deleteMany({
    where: {
      saleId: id,
    },
  });

  await prisma.sale.delete({
    where: {
      id,
    },
  });

  revalidatePath("/ventas");
  revalidatePath("/productos");
}