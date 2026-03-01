"use client";

import dynamic from "next/dynamic";

import { SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ClassifiedCard } from "../../_components/classified-card";
import { ClassifiedCardSkeleton } from "../../_components/classified-card-skeleton";

import { Prisma } from "@/lib/generated/prisma/client";

import "swiper/css";

type ClassifiedWithImages = Prisma.ClassifiedGetPayload<{
  include: {
    images: true;
  };
}>;

interface CarouselProps {
  classifieds: ClassifiedWithImages[];
  favourites: number[];
}

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <ClassifiedCardSkeleton key={i} />
      ))}
    </div>
  ),
});

export const LatestArrivalsCarousel = (props: CarouselProps) => {
  const { classifieds, favourites } = props;

  return (
    <div className="mt-8 relative">
      <Swiper
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        pagination={{ clickable: true }}
        modules={[Navigation]}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1536: {
            slidesPerView: 4,
          },
        }}
      >
        {classifieds.map((classified) => {
          return (
            <SwiperSlide key={classified.id}>
              <ClassifiedCard classified={classified} favourites={favourites} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <Button
        variant="ghost"
        type="button"
        rel="prev"
        size="icon"
        className={cn(
          "-left-16 border-2 border-border hidden lg:flex",

          "swiper-button-prev absolute top-1/2 -translate-y-1/2 z-10 flex items-center rounded-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronLeft className="h-8 w-8" color="black" />
      </Button>
      <Button
        variant="ghost"
        type="button"
        rel="next"
        size="icon"
        className={cn(
          "-right-16 border-2 border-border hidden lg:flex",
          "swiper-button-next absolute top-1/2 -translate-y-1/2 z-10 flex items-center rounded-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronRight className="h-8 w-8" color="black" />
      </Button>
    </div>
  );
};
