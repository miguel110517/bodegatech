"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteExpense(
  id: string
) {
  await prisma.expense.delete({
    where: {
      id,
    },
  });

  revalidatePath("/gastos");
}