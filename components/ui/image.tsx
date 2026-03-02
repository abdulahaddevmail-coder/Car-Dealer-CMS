"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";

type CloudinaryImageProps = Omit<ImageProps, "priority" | "loading">;

export const CloudinaryImage = (props: CloudinaryImageProps) => {
  const [error, setError] = useState(false);

  return <Image {...props} loader={error ? undefined : cloudinaryLoader} onError={() => setError(true)} />;
};
