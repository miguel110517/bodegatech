import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  const password = await bcrypt.hash("Admin123*", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "admin@bodegatech.com",
    },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@bodegatech.com",
      password,
      role: "ADMIN",
    },
  });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });