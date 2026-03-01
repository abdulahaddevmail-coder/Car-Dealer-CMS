import { Suspense } from "react";

import z from "zod";

import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/client-cookies";
import { ClassifiedStatus } from "@/lib/generated/prisma/enums";

import { Pagination } from "@/components/common/pagination";

import { Filters } from "./_components/filters";
import { DialogFilters } from "./_components/dialog-filters";
import { ClassifiedCard } from "../_components/classified-card";
import { ClassifiedCardSkeleton } from "../_components/classified-card-skeleton";

import { buildClassifiedFilterQuery } from "../_constants";

import type { PageProps } from "./_models/interfaces";
import type { Favourites } from "../_constants/interfaces";

const CLASSIFIEDS_PER_PAGE = 9;

export const PageSchema = z
  .string()
  .transform((val) => Math.max(Number(val), 1))
  .optional();

const getInventory = async (searchParams: Awaited<PageProps["searchParams"]>) => {
  const validPage = PageSchema.parse(searchParams?.page);

  // get the current page
  const page = validPage ? validPage : 1;
  const offset = (page - 1) * CLASSIFIEDS_PER_PAGE;
  return prisma.classified.findMany({
    where: buildClassifiedFilterQuery(searchParams),
    include: { images: true },
    skip: offset,
    take: CLASSIFIEDS_PER_PAGE,
  });
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const count = await prisma.classified.count({ where: buildClassifiedFilterQuery(searchParams) });

  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  const totalPages = Math.ceil(count / CLASSIFIEDS_PER_PAGE);

  const minMaxResult = await prisma.classified.aggregate({
    where: { status: ClassifiedStatus.LIVE },
    _min: {
      year: true,
      price: true,
      odoReading: true,
    },
    _max: {
      price: true,
      year: true,
      odoReading: true,
    },
  });

  return (
    <div className="flex">
      <Filters minMaxValues={minMaxResult} searchParams={searchParams} />
      <div className="flex-1 p-4 bg-white">
        <div className="flex space-y-2 items-center justify-between pb-4 -mt-1">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit">
              We have found {count} classifieds
            </h2>
            <DialogFilters minMaxValues={minMaxResult} count={count} searchParams={searchParams} />
          </div>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              styles={{
                pRoot: "justify-end hidden lg:flex",
                pLink: "border-none active:border text-black",
                pLinkActive: "bg-primary text-white hover:bg-primary hover:text-white",
              }}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          <Suspense
            fallback={
              <>
                {Array.from({ length: 8 }, (_, index) => index + 1).map((id) => (
                  <ClassifiedCardSkeleton key={id} />
                ))}
              </>
            }
          >
            {classifieds.map((classified) => (
              <div key={classified.id}>
                <ClassifiedCard
                  key={classified.id}
                  classified={classified}
                  favourites={favourites ? favourites.ids : []}
                />
              </div>
            ))}
          </Suspense>
        </div>

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            styles={{
              pRoot: "flex justify-center lg:hidden mt-5",
              pLink: "border-none active:border text-black",
              pLinkActive: "bg-primary text-white hover:bg-primary hover:text-white",
            }}
          />
        )}
      </div>
    </div>
  );
}
