import { z } from "zod";

import { env } from "@/env.mjs";

import { http } from "@/lib/http";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/client-cookies";

import { Pagination } from "@/components/common/pagination";
import { ClassifiedCard } from "../_components/classified-card";

import type { Favourites } from "../_constants/interfaces";

type Params = {
  [x: string]: string | string[];
};

type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{ [x: string]: string | string[] | undefined }>;
};

const CLASSIFIEDS_PER_PAGE = 8;

export const PageSchema = z
  .string()
  .transform((val) => Math.max(Number(val), 1))
  .optional();

export default async function FavouritesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const currentPage = PageSchema.parse(searchParams?.page);

  // get the current page
  const page = currentPage ? currentPage : 1;

  // calculate the offset
  const offset = (page - 1) * CLASSIFIEDS_PER_PAGE;

  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId ?? "");

  const { count, classifieds } = await http.get<{ count: number; classifieds: any[] }>(
    `${env.NEXT_PUBLIC_APP_URL}/api/favourites`,
    {
      searchParams: {
        page,
        pageOffset: CLASSIFIEDS_PER_PAGE,
        ids: favourites?.ids.join(","),
      },
    },
  );

  // const classifieds = await prisma.classified.findMany({
  //   where: { id: { in: favourites ? favourites.ids : [] } },
  //   include: { images: { take: 1 } },
  //   skip: offset,
  //   take: CLASSIFIEDS_PER_PAGE,
  // });

  // const count = await prisma.classified.count({
  //   where: { id: { in: favourites ? favourites.ids : [] } },
  // });

  const totalPages = Math.ceil(count / CLASSIFIEDS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80dvh]">
      <h1 className="text-3xl font-bold mb-6">Your Favourite Classifieds</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {classifieds.map((classified) => {
          return (
            <ClassifiedCard key={classified.id} classified={classified} favourites={favourites ? favourites.ids : []} />
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex">
          <Pagination
            baseURL="/favourites"
            totalPages={totalPages}
            styles={{
              pRoot: "justify-center",
              pLink: "border-none active:border",
            }}
          />
        </div>
      )}
    </div>
  );
}
