"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePurchase(
  id: string,
  formData: FormData
) {
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

  // Revertir stock anterior
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

  // Eliminar items anteriores
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

  // Crear nuevos items y actualizar inventario
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
        costPrice: cost,
      },
    });
  }

  await prisma.purchase.update({
    where: {
      id,
    },
    data: {
      providerId,
    },
  });

  revalidatePath("/compras");
  revalidatePath("/productos");
}