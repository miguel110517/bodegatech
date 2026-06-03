"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateExpense(
  id: string,
  formData: FormData
) {
  const type =
    formData.get("type")?.toString() || "";

  const description =
    formData.get("description")?.toString() || null;

  const amount = Number(
    formData.get("amount")
  );

  await prisma.expense.update({
    where: {
      id,
    },
    data: {
      type,
      description,
      amount,
    },
  });

  redirect("/gastos");
}