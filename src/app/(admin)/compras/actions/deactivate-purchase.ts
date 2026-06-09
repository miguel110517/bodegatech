"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deactivatePurchase(
  id: string
) {
  await prisma.purchase.update({
    where: {
      id,
    },
    data: {
      active: false,
      deletedAt: new Date(),
    },
  });

  revalidatePath("/compras");
}