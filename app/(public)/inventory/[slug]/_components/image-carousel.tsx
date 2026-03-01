"use client";
import { useCallback, useState } from "react";
import dynamic from "next/dynamic";

import FsLightbox from "fslightbox-react";
import { SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EffectFade, Keyboard, Navigation, Thumbs, Virtual } from "swiper/modules";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";

import type { Swiper as SwiperType } from "swiper/types";
import type { Image as PrismaImage } from "@/lib/generated/prisma/client";

import "swiper/css";
import "swiper/css/virtual";
import "swiper/css/effect-fade";
import { CloudinaryImage } from "@/components/ui/image";
import Image from "next/image";

interface ImageCarouselProps {
  images: PrismaImage[];
}

const CarouselSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <Skeleton className="aspect-3/2 w-full" />
      <div className="grid grid-cols-4 mt-2 gap-2">
        <Skeleton className="aspect-3/2" />
        <Skeleton className="aspect-3/2" />
        <Skeleton className="aspect-3/2" />
        <Skeleton className="aspect-3/2" />
      </div>
    </div>
  );
};

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
  loading: () => <CarouselSkeleton />,
});

const SwiperThumb = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
  loading: () => null,
});

export const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    sourceIndex: 0,
  });

  const setSwiper = (swiper: SwiperType) => {
    setThumbsSwiper(swiper);
  };

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  }, []);

  const handleImageClick = useCallback(() => {
    setLightboxController((prev) => ({
      toggler: !prev.toggler,
      sourceIndex: activeIndex,
    }));
  }, [activeIndex]);

  const sources = images.map((image) => cloudinaryLoader({ src: image.src, width: 2400, quality: 100 }));

  return (
    <>
      <FsLightbox
        toggler={lightboxController.toggler}
        sourceIndex={lightboxController.sourceIndex}
        sources={sources}
        type="image"
      />
      <div className="relative">
        <Swiper
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[EffectFade, Navigation, Thumbs, Virtual]}
          // keyboard={{ enabled: true }}
          virtual={{
            addSlidesAfter: 8,
            enabled: true,
          }}
          className="aspect-3/2"
          onSlideChange={handleSlideChange}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id} virtualIndex={index}>
              <Image
                placeholder="blur"
                blurDataURL={image.blurHash}
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                quality={45}
                className="aspect-3/2 object-cover rounded-md cursor-pointer"
                onClick={handleImageClick}
              />
              {/* <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {activeIndex + 1} / {images.length}
              </div> */}
            </SwiperSlide>
          ))}
        </Swiper>
        <Button
          variant="ghost"
          type="button"
          rel="prev"
          size="icon"
          className={cn(
            "left-4 bg-white",
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
            "right-4 bg-white",
            "swiper-button-next absolute top-1/2 -translate-y-1/2 z-10 flex items-center rounded-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <ChevronRight className="h-8 w-8" color="black" />
        </Button>
      </div>
      <SwiperThumb
        onSwiper={setSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs, EffectFade]}
      >
        {images.map((image) => (
          <SwiperSlide className="relative mt-2 h-fit w-full cursor-grab" key={image.id}>
            <CloudinaryImage
              className="object-cover aspect-3/2 rounded-md"
              width={150}
              height={100}
              src={image.src}
              alt={image.alt}
              quality={1}
              placeholder="blur"
              blurDataURL={image.blurHash}
            />
          </SwiperSlide>
        ))}
      </SwiperThumb>
    </>
  );
};
