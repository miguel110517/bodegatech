"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSale(id: string, formData: FormData) {
  const invoice = formData.get("invoice")?.toString() || null;

  const customerId = formData.get("customerId")?.toString() || "";

  const productId = formData.getAll("productId") as string[];

  const quantity = formData.getAll("quantity") as string[];

  if (!customerId) {
    throw new Error("Debe seleccionar un cliente");
  }

  if (productId.length === 0) {
    throw new Error("Debe agregar al menos un producto");
  }

  const sale = await prisma.sale.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!sale) {
    throw new Error("La venta no existe");
  }

  // DEVOLVER STOCK ANTERIOR

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

  // BORRAR ITEMS ANTERIORES

  await prisma.saleItem.deleteMany({
    where: {
      saleId: id,
    },
  });

  // ACTUALIZAR CABECERA

  await prisma.sale.update({
    where: {
      id,
    },
    data: {
      invoice,
      customerId,
    },
  });

  // CREAR NUEVOS ITEMS

  for (let i = 0; i < productId.length; i++) {
    const qty = Number(quantity[i]);

    const product = await prisma.product.findUnique({
      where: {
        id: productId[i],
      },
    });

    if (!product) {
      continue;
    }

    if (product.stock < qty) {
      throw new Error(`Stock insuficiente para ${product.name}`);
    }

    await prisma.saleItem.create({
      data: {
        saleId: id,
        productId: product.id,
        quantity: qty,

        costPrice: product.costPrice,
        salePrice: product.salePrice,
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

  revalidatePath("/ventas");
  revalidatePath("/productos");

  return {
    success: true,
    message: "Venta editada correctamente",
  };
}
