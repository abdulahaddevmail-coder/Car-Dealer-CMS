import { faker } from "@faker-js/faker";
import { CustomerStatus, type Prisma, type PrismaClient } from "@/lib/generated/prisma/client";

export async function seedCustomers(prisma: PrismaClient) {
  const customerClassifieds = await prisma.classified.findMany({
    take: 5,
    select: { id: true },
    orderBy: { fuelType: "asc" },
  });

  const customers: Prisma.CustomerCreateManyInput[] = Array.from({ length: 5 }).map((_, index) => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    mobile: faker.phone.number(),
    status: faker.helpers.arrayElement(Object.values(CustomerStatus)),
    classifiedId: customerClassifieds[index].id,
  }));

  const result = await prisma.customer.createMany({ data: customers });

  console.log(`${result.count} customers created 🌱`);
}
