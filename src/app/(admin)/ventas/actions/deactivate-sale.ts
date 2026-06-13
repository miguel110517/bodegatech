"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deactivateSale(id: string) {
  const sale = await prisma.sale.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!sale) {
    throw new Error("Venta no encontrada");
  }

  if (!sale.active) {
    throw new Error("La venta ya está desactivada");
  }

  // DEVOLVER STOCK
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

  // DESACTIVAR VENTA
  await prisma.sale.update({
    where: {
      id,
    },
    data: {
      active: false,
      deletedAt: new Date(),
    },
  });

  // DESACTIVAR CUENTA POR COBRAR
  await prisma.accountReceivable.updateMany({
    where: {
      saleId: id,
    },
    data: {
      active: false,
      deletedAt: new Date(),
    },
  });

  revalidatePath("/ventas");
  revalidatePath("/ventas/desactivadas");
  revalidatePath("/productos");
  revalidatePath("/cuentas-por-cobrar");
}