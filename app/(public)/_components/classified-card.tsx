"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HTMLParser } from "@/components/common/html-parser";
import { FavouriteButton } from "../inventory/_components/favourite-button";

import { Prisma } from "@/lib/generated/prisma/client";
import { formatNumber, formatOdometerUnit, formatText, formatPrice } from "@/lib/utils";

import { ReservationSteps } from "../_constants/constants";

type ClassifiedCardProps = Prisma.ClassifiedGetPayload<{ include: { images: true } }>;

const getKeyClassifiedInfo = (classified: ClassifiedCardProps) => {
  return [
    {
      id: "odoReading",
      icon: <GaugeCircle className="w-4 h-4" />,
      value: `${formatNumber(classified.odoReading)} ${formatOdometerUnit(classified.odoUnit)}`,
    },
    {
      id: "transmission",
      icon: <Cog className="w-4 h-4" />,
      value: classified?.transmision ? formatText(classified.transmision) : null,
    },
    {
      id: "fuelType",
      icon: <Fuel className="w-4 h-4" />,
      value: classified?.fuelType ? formatText(classified.fuelType) : null,
    },
    {
      id: "colour",
      icon: <Paintbrush2 className="w-4 h-4" />,
      value: classified?.color ? formatText(classified.color) : null,
    },
  ];
};

export const ClassifiedCard = ({
  favourites,
  classified,
}: {
  favourites: number[];
  classified: ClassifiedCardProps;
}) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isFavourite, setIsFavourite] = useState(favourites.includes(classified.id));

  useEffect(() => {
    if (!isFavourite && pathname === "/favourites") setIsVisible(false);
  }, [isFavourite, pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white relative rounded-md shadow-md overflow-hiddem flex flex-col"
        >
          <div className="aspect-3/2 relative rounded-md">
            <Link href={`/inventory/${classified.slug}`}>
              <Image
                fill
                // quality={25}
                // placeholder="blur"
                // blurDataURL={classified.images[0]?.blurHash || ""}
                // src={classified.images[0]?.src || ""}
                src="/car-placeholder.webp"
                alt={classified.images[0]?.alt}
                className="object-cover bg-neutral-100 rounded-t-md"
                onError={(e) => (e.currentTarget.src = "/car-placeholder.webp")}
              />
            </Link>
            <FavouriteButton setIsFavourite={setIsFavourite} isFavourite={isFavourite} id={classified.id} />
            <div className="absolute top-2.5 right-3.5 bg-primary text-slate-50 font-bold px-2 py-1 rounded">
              <p className="text-xs lg:text-base xl:text-lg font-semibold">
                {formatPrice({
                  price: classified.price,
                  currency: classified.currency,
                })}
              </p>
            </div>
          </div>
          <div className="p-4 flex flex-col space-y-3">
            <div>
              <Link
                href={`/inventory/${classified.slug}`}
                className="text-sm md:text-base lg:text-lg font-semibold line-clamp-1 transition-colors hover:text-primary"
              >
                {classified.title}
              </Link>
              {classified?.description && (
                <div className="text-xs md:text-sm xl:text-base text-gray-500 line-clamp-2">
                  <HTMLParser html={classified.description} />
                  &nbsp; {/* Used for equal spacing across each card in the grid */}
                </div>
              )}

              <ul className="text-xs md:text-sm text-gray-600 grid grid-cols-2 2xl:flex gap-1 items-center justify-between w-full mt-2">
                {getKeyClassifiedInfo(classified)
                  .filter((v) => v.value)
                  .map(({ id, icon, value }) => (
                    <li key={id} className="font-semibold flex xl:flex-col items-center gap-x-1.5">
                      {icon} {value}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:gap-x-2 w-full">
              <Button
                className="flex-1 transition-colors hover:border-white hover:bg-primary hover:text-white py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
                asChild
                variant="outline"
                size="sm"
              >
                <Link href={`/inventory/${classified.slug}/reserve?step=${ReservationSteps.WELCOME}`}>Reserve</Link>
              </Button>
              <Button className="flex-1 py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base" asChild size="sm">
                <Link href={`/inventory/${classified.slug}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
