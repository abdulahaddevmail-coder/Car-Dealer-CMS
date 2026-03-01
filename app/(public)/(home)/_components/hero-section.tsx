import Link from "next/link";

import { SearchButton } from "./search-button";
import { Button } from "@/components/ui/button";
import { HomepageTaxonomyFilters } from "./homepage-filters";

import { prisma } from "@/lib/prisma";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";
import { ClassifiedStatus } from "@/lib/generated/prisma/enums";

import { buildClassifiedFilterQuery } from "../../_constants";

import type { AwaitedPageProps } from "../../inventory/_models/interfaces";

export const HeroSection = async ({ searchParams }: { searchParams: AwaitedPageProps["searchParams"] }) => {
  const totalFiltersApplied = Object.keys(searchParams || {}).length;
  const isFilterApplied = totalFiltersApplied > 0;

  const classifiedsCount = await prisma.classified.count({
    where: buildClassifiedFilterQuery(searchParams),
  });

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
    <section
      className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage: `url(${cloudinaryLoader({ src: "/cars-lineup.jpg", width: 1280, quality: 100 })})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-75" />
      <div className="container xl:grid space-y-12 grid-cols-2 items-center relative z-10">
        <div className="px-10 xl:px-0">
          <h1 className="text-2xl text-center xl:text-left md:text-4xl xl:text-7xl tracking-wider leading-(--text-7xl--line-height) uppercase font-extrabold text-white">
            Unbeatable Deals on New & Used Cars
          </h1>
          <h2 className="mt-4 uppercase text-center xl:text-left text-base md:text-3xl xl:text-4xl text-white">
            Discover your dream car today
          </h2>
        </div>
        <div className="max-w-md w-full mx-auto p-6 bg-white sm:rounded-xl shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2 flex flex-col w-full gap-x-4">
              <HomepageTaxonomyFilters minMaxValues={minMaxResult} searchParams={searchParams} />
            </div>
            <SearchButton count={classifiedsCount} />
            {isFilterApplied && (
              <Button asChild variant="outline" className="w-full hover:bg-slate-200">
                <Link href="/">Clear Filters ({totalFiltersApplied})</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
