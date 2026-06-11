"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function activateSale(id: string) {
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

  if (sale.active) {
    throw new Error("La venta ya está activa");
  }

  // VALIDAR STOCK
  for (const item of sale.items) {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `No hay stock suficiente para ${product.name}`
      );
    }
  }

  // DESCONTAR STOCK
  for (const item of sale.items) {
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

  // ACTIVAR VENTA
  await prisma.sale.update({
    where: {
      id,
    },
    data: {
      active: true,
      deletedAt: null,
    },
  });

  revalidatePath("/ventas");
  revalidatePath("/ventas/desactivadas");
  revalidatePath("/productos");
  revalidatePath("/cuentas-por-cobrar");
}