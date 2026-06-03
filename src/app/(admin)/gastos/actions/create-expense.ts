"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExpense(
  formData: FormData
) {
  const type =
    formData.get("type")?.toString() || "";

  const description =
    formData.get("description")?.toString() || null;

  const amount = Number(
    formData.get("amount")
  );

  await prisma.expense.create({
    data: {
      type,
      description,
      amount,
    },
  });

  revalidatePath("/gastos");
}