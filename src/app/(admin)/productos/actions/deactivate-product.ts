"use server";

import { prisma } from "@/lib/prisma";

export async function deactivateProduct(id: string) {

  await prisma.product.update({
    where: {
      id,
    },

    data: {
      active: false,
    },
  });
}