"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSale(formData: FormData) {
  const invoice =
    formData.get("invoice")?.toString() || null;

  const customerId =
    formData.get("customerId")?.toString() || "";

  const productId =
    formData.getAll("productId") as string[];

  const quantity =
    formData.getAll("quantity") as string[];

  const sale = await prisma.sale.create({
    data: {
      invoice,
      customerId,
    },
  });

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
      throw new Error(
        `Stock insuficiente para ${product.name}`
      );
    }

    await prisma.saleItem.create({
      data: {
        saleId: sale.id,
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
}