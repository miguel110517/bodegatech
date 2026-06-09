"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function activatePurchase(id: string) {
  await prisma.purchase.update({
    where: {
      id,
    },
    data: {
      active: true,
      deletedAt: null,
    },
  });

  revalidatePath("/compras");
  revalidatePath("/compras/desactivadas");
}