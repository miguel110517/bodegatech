"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const brand = formData.get("brand")?.toString().trim();

  const imageUrl =
    formData.get("imageUrl")?.toString().trim() || null;

  const salePrice = Number(formData.get("salePrice"));

  const offerPrice = formData.get("offerPrice")
    ? Number(formData.get("offerPrice"))
    : null;

  const minStock = Number(formData.get("minStock"));

  const location =
    formData.get("location")?.toString().trim() || null;

  const categoryId =
    formData.get("categoryId")?.toString();

  if (!name || !categoryId) return;

  const productos = await prisma.product.findMany({
    select: {
      code: true,
    },
  });

  let mayorNumero = 0;

  for (const producto of productos) {
    if (!producto.code?.startsWith("BTI-")) continue;

    const numero = parseInt(
      producto.code.replace("BTI-", "")
    );

    if (!isNaN(numero) && numero > mayorNumero) {
      mayorNumero = numero;
    }
  }

  const code = `BTI-${String(mayorNumero + 1).padStart(4, "0")}`;

  await prisma.product.create({
    data: {
      code,
      name,
      description,
      brand,
      imageUrl,

      costPrice: 0,
      stock: 0,

      salePrice,
      offerPrice,

      minStock,
      location,
      categoryId,
    },
  });

  revalidatePath("/productos");
  revalidatePath("/");
}