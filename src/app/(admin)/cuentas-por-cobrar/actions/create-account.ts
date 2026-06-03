"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAccount(
  formData: FormData
) {
  const saleId =
    formData.get("saleId")?.toString() || "";

  const totalAmount = Number(
    formData.get("totalAmount")
  );

  const paidAmount = Number(
    formData.get("paidAmount") || 0
  );

  const pendingAmount =
    totalAmount - paidAmount;

  const dueDate =
    formData.get("dueDate")?.toString();

  await prisma.accountReceivable.create({
    data: {
      saleId,
      totalAmount,
      paidAmount,
      pendingAmount,
      dueDate: dueDate
        ? new Date(dueDate)
        : null,
      status:
        pendingAmount <= 0
          ? "PAID"
          : "PENDING",
    },
  });

  revalidatePath(
    "/cuentas-por-cobrar"
  );
}