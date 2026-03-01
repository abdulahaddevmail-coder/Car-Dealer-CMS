"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImage(file: string) {
  const result = await cloudinary.uploader.upload(file, {
    folder: "classifieds",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}
