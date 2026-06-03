"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProduct(
  id: string,
  formData: FormData
) {
  await prisma.product.update({
    where: {
      id,
    },
    data: {
      name: formData.get("name")?.toString(),
      description: formData.get("description")?.toString(),
      brand: formData.get("brand")?.toString(),

      costPrice: Number(formData.get("costPrice")),
      salePrice: Number(formData.get("salePrice")),

      offerPrice: formData.get("offerPrice")
        ? Number(formData.get("offerPrice"))
        : null,

      stock: Number(formData.get("stock")),
      minStock: Number(formData.get("minStock")),

      location: formData.get("location")?.toString(),

      categoryId: formData.get("categoryId")?.toString()!,
    },
  });

  revalidatePath("/productos");
}