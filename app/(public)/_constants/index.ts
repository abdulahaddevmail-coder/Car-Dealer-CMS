import z from "zod";

import { Prisma } from "@/lib/generated/prisma/client";
import { ClassifiedStatus } from "@/lib/generated/prisma/enums";

import type { AwaitedPageProps } from "../inventory/_models/interfaces";

export const navLinks = [
  { id: 1, href: "/", label: "Home" },
  { id: 2, href: "/inventory", label: "Inventory" },
];

export const ClassifiedFilterSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  modelVariant: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minReading: z.string().optional(),
  maxReading: z.string().optional(),
  currency: z.string().optional(),
  odoUnit: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  colour: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  ulezCompliance: z.string().optional(),
});

export const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined,
): Prisma.ClassifiedWhereInput => {
  const { data } = ClassifiedFilterSchema.safeParse(searchParams);

  if (!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data);

  const taxonomyFilters = ["make", "model", "modelVariant"];

  const rangeFilters = {
    minYear: "year",
    maxYear: "year",
    minPrice: "price",
    maxPrice: "price",
    minReading: "odoReading",
    maxReading: "odoReading",
  };

  const numFilters = ["seats", "doors"];
  const enumFilters = ["odoUnit", "currency", "transmision", "bodyType", "fuelType", "color", "ulezCompliance"];

  const mapParamsToFields = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined;
      if (!value) return acc;

      if (taxonomyFilters.includes(key)) {
        acc[key] = { id: Number(value) };
      } else if (enumFilters.includes(key)) {
        acc[key] = value.toUpperCase();
      } else if (numFilters.includes(key)) {
        acc[key] = Number(value);
      } else if (key in rangeFilters) {
        const field = rangeFilters[key as keyof typeof rangeFilters];
        acc[field] = acc[field] || {};
        if (key.startsWith("min")) {
          acc[field].gte = Number(value);
        } else if (key.startsWith("max")) {
          acc[field].lte = Number(value);
        }
      }

      return acc;
    },
    {} as { [key: string]: any },
  );

  return {
    status: ClassifiedStatus.LIVE,
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },

        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),
    ...mapParamsToFields,
  };
};
