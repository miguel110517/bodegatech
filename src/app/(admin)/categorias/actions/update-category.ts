"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCategory(
  id: string,
  formData: FormData
) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) return;

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      description,
    },
  });

  revalidatePath("/categorias");
}