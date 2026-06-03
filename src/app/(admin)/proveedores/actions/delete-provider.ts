"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProvider(
  id: string
) {
  await prisma.provider.delete({
    where: {
      id,
    },
  });

  revalidatePath("/proveedores");
}