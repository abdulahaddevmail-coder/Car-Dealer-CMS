import { bcryptPasswordHash } from "@/lib/bcrypt";
import type { PrismaClient } from "@/lib/generated/prisma/client";

export async function seedAdmin(prisma: PrismaClient) {
  const password = await bcryptPasswordHash("abc123#");

  const admin = await prisma.user.create({
    data: {
      email: "dev@tlr.je",
      hashedPassword: password,
    },
  });

  console.log("Admin created: ", admin);

  return admin;
}
