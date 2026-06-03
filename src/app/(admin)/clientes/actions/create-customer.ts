"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
  const name = formData.get("name")?.toString() || "";

  await prisma.customer.create({
    data: {
      name,
      document: formData.get("document")?.toString(),
      phone: formData.get("phone")?.toString(),
      whatsapp: formData.get("whatsapp")?.toString(),
      email: formData.get("email")?.toString(),
      address: formData.get("address")?.toString(),
      observations: formData.get("observations")?.toString(),
    },
  });

  revalidatePath("/clientes");
}