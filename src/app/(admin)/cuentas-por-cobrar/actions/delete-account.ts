"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAccount(
  id: string
) {
  await prisma.payment.deleteMany({
    where: {
      accountId: id,
    },
  });

  await prisma.accountReceivable.delete({
    where: {
      id,
    },
  });

  revalidatePath(
    "/cuentas-por-cobrar"
  );
}