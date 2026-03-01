import type { ImageLoaderProps } from "next/image";

interface LoaderProps extends ImageLoaderProps {
  height?: number;
}

export const cloudinaryLoader = ({ src, width, quality, height }: LoaderProps) => {
  if (!src.includes("/upload/")) return src;

  const transformations = [
    `w_${width}`,
    height ? `h_${height}` : "",
    "c_fill",
    "f_auto",
    quality ? `q_${quality}` : "q_auto",
  ]
    .filter(Boolean)
    .join(",");

  return src.replace("/upload/", `/upload/${transformations}/`);
};
