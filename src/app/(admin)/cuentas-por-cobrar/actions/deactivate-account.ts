"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deactivateAccount(id: string) {
  await prisma.accountReceivable.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });

  revalidatePath("/cuentas-por-cobrar");
}