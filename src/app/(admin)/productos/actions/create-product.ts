"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const brand = formData.get("brand")?.toString().trim();

  const imageUrl =
    formData.get("imageUrl")?.toString().trim() || null;

  const costPrice = Number(formData.get("costPrice"));
  const salePrice = Number(formData.get("salePrice"));
  const offerPrice = formData.get("offerPrice")
    ? Number(formData.get("offerPrice"))
    : null;

  const stock = Number(formData.get("stock"));
  const minStock = Number(formData.get("minStock"));

  const location = formData.get("location")?.toString().trim();

  const categoryId = formData.get("categoryId")?.toString();

  if (!name || !categoryId) return;

  const total = await prisma.product.count();

  const code = `BTI-${String(total + 1).padStart(4, "0")}`;

  await prisma.product.create({
    data: {
      code,
      name,
      description,
      brand,
      imageUrl,
      costPrice,
      salePrice,
      offerPrice,
      stock,
      minStock,
      location,
      categoryId,
    },
  });

  revalidatePath("/productos");
}