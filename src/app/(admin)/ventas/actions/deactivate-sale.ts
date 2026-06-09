"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deactivateSale(id: string) {
  await prisma.sale.update({
    where: {
      id,
    },
    data: {
      active: false,
      deletedAt: new Date(),
    },
  });

  revalidatePath("/ventas");
  revalidatePath("/ventas/desactivadas");
}
