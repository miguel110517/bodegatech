"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateAccount(
  id: string,
  formData: FormData
) {
  const dueDate =
    formData.get("dueDate")?.toString();

  await prisma.accountReceivable.update({
    where: {
      id,
    },
    data: {
      dueDate: dueDate
        ? new Date(dueDate)
        : null,
    },
  });

  redirect(
    "/cuentas-por-cobrar"
  );
}