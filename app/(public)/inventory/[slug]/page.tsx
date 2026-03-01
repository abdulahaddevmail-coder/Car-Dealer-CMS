import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import {
  CheckIcon,
  XIcon,
  Fingerprint,
  CarIcon,
  FuelIcon,
  PowerIcon,
  GaugeIcon,
  UsersIcon,
  CarFrontIcon,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { ClassifiedStatus } from "@/lib/generated/prisma/enums";

import { formatNumber, formatOdometerUnit, formatPrice, formatText } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { HTMLParser } from "@/components/common/html-parser";
import { ImageCarousel } from "./_components/image-carousel";

import { ReservationSteps } from "../../_constants/constants";

import type { PageProps } from "../_models/interfaces";

const features = (props: Prisma.ClassifiedGetPayload<{ include: { make: true; images: true } }>) => [
  {
    id: 1,
    icon:
      props.ulezCompliance === "EXEMPT" ? (
        <CheckIcon className="w-6 h-6 mx-auto text-green-500" />
      ) : (
        <XIcon className="w-6 h-6 mx-auto text-red-500" />
      ),
    label: formatText(props.ulezCompliance),
  },
  {
    id: 2,
    icon: <Fingerprint className="w-6 h-6 mx-auto text-gray-500" />,
    label: props.vrm,
  },
  {
    id: 3,
    icon: <CarIcon className="w-6 h-6 mx-auto text-gray-500" />,
    label: formatText(props.bodyType),
  },
  {
    id: 4,
    icon: <FuelIcon className="w-6 h-6 mx-auto text-gray-500" />,
    label: formatText(props.fuelType),
  },
  {
    id: 5,
    icon: <PowerIcon className="w-6 h-6 mx-auto text-gray-500" />,
    label: formatText(props.transmision),
  },
  {
    id: 6,
    icon: <GaugeIcon className="w-6 h-6 mx-auto text-gray-500" />,
    label: `${formatNumber(props.odoReading)} ${formatOdometerUnit(props.odoUnit)}`,
  },
  {
    id: 7,
    icon: <UsersIcon className="w-6 h-6 mx-auto text-gray-500" />,
    label: props.seats,
  },
  {
    id: 8,
    icon: <CarFrontIcon className="w-6 h-6 mx-auto text-gray-500" />,
    label: props.doors,
  },
];

export default async function ClassifiedPage(props: PageProps) {
  const params = await props?.params;

  const slug = decodeURIComponent(params?.slug as string);

  if (!slug) notFound();

  const classified = await prisma.classified.findUnique({
    where: { slug },
    include: { make: true, images: true },
  });

  if (!classified) notFound();

  if (classified.status === ClassifiedStatus.SOLD) {
    redirect(`/inventory/${classified.slug}/not-available`);
  }

  return (
    <div className="flex flex-col container mx-auto px-4 md:px-12 py-12">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <ImageCarousel images={classified.images} />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <Image
              src={classified.make.image || ""}
              alt={classified.make.name}
              className="w-20 mr-4"
              width={120}
              height={120}
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {classified.title} {classified.id}
              </h1>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2 mb-2">
            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
              {classified.year}
            </span>
            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
              {formatNumber(classified.odoReading)} {formatOdometerUnit(classified.odoUnit)}
            </span>
            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
              {formatText(classified.color)}
            </span>
            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
              {formatText(classified.fuelType)}
            </span>
          </div>
          {classified.description && (
            <div className="mb-4">
              <HTMLParser html={classified.description} />
            </div>
          )}

          <div className="text-4xl font-bold my-4 w-full border border-slate-200 flex justify-center items-center rounded-xl py-12">
            Our Price: {formatPrice({ price: classified.price, currency: classified.currency })}
          </div>
          <Button className="uppercase font-bold py-3 px-6 rounded w-full mb-4" size="lg" asChild>
            <Link href={`/inventory/${slug}/reserve?step=${ReservationSteps.WELCOME}`}>Reserve Now</Link>
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features(classified).map(({ id, icon, label }) => (
              <div key={id} className="bg-gray-100 rounded-lg shadow-xs p-4 text-center flex items-center flex-col">
                {icon}
                <p className="text-sm font-medium mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
