import { prisma } from "@/lib/prisma";
import { seedTaxonomy } from "./taxonomy.seed";
import { seedClassifieds } from "./classifieds.seed";
import { seedImages } from "./images.seed";

async function seed() {
  // await prisma.$executeRaw`TRUNCATE TABLE "makes" RESTART IDENTITY CASCADE`;
  // await seedTaxonomy(prisma);
  // await prisma.$executeRaw`TRUNCATE TABLE "classifieds" RESTART IDENTITY CASCADE`;
  // await seedClassifieds(prisma);
  await seedImages(prisma);

  // await seedAdmin(prisma);
  // await seedCustomers(prisma);

  console.log("Seeding working.");
}

seed()
  .then(() => {
    console.log("Seeding completed.");
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Error seeding data:", error);
    prisma.$disconnect();
  });
