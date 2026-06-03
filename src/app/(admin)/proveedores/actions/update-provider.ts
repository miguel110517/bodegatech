"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProvider(
  id: string,
  formData: FormData
) {
  await prisma.provider.update({
    where: {
      id,
    },
    data: {
      name: formData.get("name")?.toString(),
      document: formData.get("document")?.toString(),
      phone: formData.get("phone")?.toString(),
      whatsapp: formData.get("whatsapp")?.toString(),
      email: formData.get("email")?.toString(),
      address: formData.get("address")?.toString(),
      observations: formData.get("observations")?.toString(),
    },
  });

  revalidatePath("/proveedores");
}