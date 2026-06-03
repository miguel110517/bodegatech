"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return;

  const existe = await prisma.category.findFirst({
    where: {
      name,
    },
  });

  if (existe) {
    throw new Error("La categoría ya existe");
  }

  await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  revalidatePath("/categorias");
}