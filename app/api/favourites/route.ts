import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import z from "zod";

import { prisma } from "@/lib/prisma";

import { redis } from "@/lib/redis-store";
import { setSourceId } from "@/lib/client-cookies";

interface Favourites {
  ids: number[];
}

const validateIdSchema = z.object({ id: z.number().int() });

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { data, error } = validateIdSchema.safeParse(body);

  if (!data) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }

  if (typeof data.id !== "number") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  // get the source id from cookies
  const sourceId = await setSourceId();

  // retrieve the existing favourites from redis session
  const storedFavourites = await redis.get<Favourites>(sourceId);
  const favourites: Favourites = storedFavourites || { ids: [] };

  if (favourites.ids.includes(data.id)) {
    // add or remove the ID based on its current presence in the favourites
    // remove the ID if it already exists
    favourites.ids = favourites.ids.filter((favId) => favId !== data.id);
  } else {
    // add the id of it does not exist
    favourites.ids.push(data.id);
  }

  // update the redis store with the new list of ids
  await redis.set(sourceId, favourites);

  revalidatePath("/favourites");

  return NextResponse.json({ ids: favourites.ids }, { status: 200 });
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const CLASSIFIEDS_PER_PAGE = Number(searchParams.get("pageOffset") || 1);

    const offset = (page - 1) * CLASSIFIEDS_PER_PAGE;

    // Example: You may be storing favourites in cookies / session / DB
    // Replace this with your real source
    const favourites = {
      ids: searchParams.get("ids") ? searchParams.get("ids")!.split(",") : [],
    };

    if (!favourites.ids.length) {
      return NextResponse.json({
        count: 0,
        classifieds: [],
      });
    }

    const favouriteIds: number[] = (favourites.ids || []).map((id) => Number(id)).filter(Boolean);

    const [classifieds, count] = await Promise.all([
      prisma.classified.findMany({
        where: {
          id: { in: favouriteIds },
        },
        include: {
          images: { take: 1 },
        },
        skip: offset,
        take: CLASSIFIEDS_PER_PAGE,
      }),

      prisma.classified.count({
        where: {
          id: { in: favouriteIds },
        },
      }),
    ]);

    return NextResponse.json({
      count,
      classifieds,
    });
  } catch (error) {
    console.error("Favourites API Error:", error);

    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
