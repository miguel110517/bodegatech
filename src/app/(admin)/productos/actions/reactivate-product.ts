"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reactivateProduct(
  id: string
) {
  await prisma.product.update({
    where: {
      id,
    },
    data: {
      active: true,
      deletedAt: null,
    },
  });

  revalidatePath("/productos");
  revalidatePath(
    "/productos/desactivados"
  );
}