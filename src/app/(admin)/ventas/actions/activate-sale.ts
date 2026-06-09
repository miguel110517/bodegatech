"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function activateSale(id: string) {
  await prisma.sale.update({
    where: {
      id,
    },
    data: {
      active: true,
      deletedAt: null,
    },
  });

  revalidatePath("/ventas");
  revalidatePath("/ventas/desactivadas");
}