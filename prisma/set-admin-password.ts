import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "alejandra@miradorpropiedades.cl";
  const newPassword = process.env.ADMIN_NEW_PASSWORD;
  if (!newPassword) throw new Error("Define ADMIN_NEW_PASSWORD antes de ejecutar.");

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const user = await prisma.adminUser.update({
    where: { email },
    data: { passwordHash },
  });
  console.log(`Contraseña actualizada para ${user.email}`);
}

main().finally(() => prisma.$disconnect());
