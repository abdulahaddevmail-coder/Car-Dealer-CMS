import { Prisma } from "@/lib/generated/prisma/client";

export interface ISidebarProps {
  minMaxValues: Prisma.GetClassifiedAggregateType<{
    _min: {
      year: true;
      price: true;
      odoReading: true;
    };
    _max: {
      year: true;
      odoReading: true;
      price: true;
    };
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface Favourites {
  ids: number[];
}
