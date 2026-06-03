"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPayment(
  formData: FormData
) {
  const accountId =
    formData.get("accountId")?.toString() || "";

  const amount = Number(
    formData.get("amount")
  );

  const notes =
    formData.get("notes")?.toString() || null;

  const account =
    await prisma.accountReceivable.findUnique({
      where: {
        id: accountId,
      },
    });

  if (!account) return;

  await prisma.payment.create({
    data: {
      accountId,
      amount,
      notes,
    },
  });

  const paidAmount =
    account.paidAmount + amount;

  const pendingAmount =
    account.totalAmount - paidAmount;

  await prisma.accountReceivable.update({
    where: {
      id: accountId,
    },
    data: {
      paidAmount,
      pendingAmount,
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