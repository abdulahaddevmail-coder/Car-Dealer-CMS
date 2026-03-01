import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@/lib/generated/prisma/client";
import { createPngDataUri } from "unlazy/thumbhash";
import { imageSources } from "@/config/constants";

const classifiedId = 4;

export async function seedImages(prisma: PrismaClient) {
  await prisma.image.deleteMany({
    where: {
      classifiedId: classifiedId,
    },
  });

  await prisma.image.createMany({
    data: [
      {
        src: "https://res.cloudinary.com/dxlmztsik/image/upload/v1772360662/car1_mknxqo.jpg",
        alt: faker.lorem.words(2),
        classifiedId: classifiedId,
        blurHash: createPngDataUri("jPcJDYCndnZwl4h6Z2eYhWZ/c/VI"),
      },
      {
        src: "https://res.cloudinary.com/dxlmztsik/image/upload/v1772360683/car2_mv3brz.jpg",
        alt: faker.lorem.words(2),
        classifiedId: classifiedId,
        blurHash: createPngDataUri("jPcJDYCndnZwl4h6Z2eYhWZ/c/VI"),
      },
      {
        src: "https://res.cloudinary.com/dxlmztsik/image/upload/v1772360683/car3_r60ivq.jpg",
        alt: faker.lorem.words(2),
        classifiedId: classifiedId,
        blurHash: createPngDataUri("jPcJDYCndnZwl4h6Z2eYhWZ/c/VI"),
      },
    ],
  });
  // const classifieds = await prisma.classified.findMany();

  // const classifiedIds = classifieds.map((classified) => classified.id);

  // for (const classifiedId of classifiedIds) {
  //   const image: Prisma.ImageCreateInput = {
  //     src: imageSources.classifiedPlaceholder,
  //     alt: faker.lorem.words(2),
  //     classified: { connect: { id: classifiedId } },
  //     blurHash: createPngDataUri("jPcJDYCndnZwl4h6Z2eYhWZ/c/VI"),
  //   };

  //   await prisma.image.create({ data: image });
  // }
}
