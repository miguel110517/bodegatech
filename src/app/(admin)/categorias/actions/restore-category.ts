"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function restoreCategory(id: string) {
  await prisma.category.update({
    where: {
      id,
    },
    data: {
      active: true,
      deletedAt: null,
    },
  });

  revalidatePath("/categorias");
  revalidatePath("/categorias/desactivadas");
}