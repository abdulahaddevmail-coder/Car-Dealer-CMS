/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('SUBSCRIBED', 'INTRESTED', 'CONTACTED', 'PURCHASED', 'COLD');

-- CreateEnum
CREATE TYPE "odoUnit" AS ENUM ('MILES', 'KILOMETERS');

-- CreateEnum
CREATE TYPE "ULEZCompliance" AS ENUM ('EXEMPT', 'NON_EXEMPT');

-- CreateEnum
CREATE TYPE "Transmision" AS ENUM ('MANUAL', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('WHITE', 'BLACK', 'GREY', 'SILVER', 'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'BROWN', 'PURPLE');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('HATCHBACK', 'SEDAN', 'SUV', 'COUPE', 'CONVERTIBLE', 'WAGON', 'VAN', 'PICKUP');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('PKR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD');

-- CreateEnum
CREATE TYPE "ClassifiedStatus" AS ENUM ('DRAFT', 'SOLD', 'LIVE');

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "classifieds" (
    "id" SERIAL NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "slug" TEXT NOT NULL,
    "vrm" TEXT,
    "title" TEXT,
    "description" TEXT,
    "year" INTEGER NOT NULL,
    "odo_reading" INTEGER NOT NULL DEFAULT 0,
    "doors" INTEGER NOT NULL DEFAULT 2,
    "seats" INTEGER NOT NULL DEFAULT 4,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "make_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,
    "model_variat_id" INTEGER NOT NULL,
    "ulezCompliance" "ULEZCompliance" NOT NULL DEFAULT 'EXEMPT',
    "transmision" "Transmision" NOT NULL DEFAULT 'MANUAL',
    "color" "Color" NOT NULL DEFAULT 'WHITE',
    "fuel_type" "FuelType" NOT NULL DEFAULT 'PETROL',
    "body_type" "BodyType" NOT NULL DEFAULT 'HATCHBACK',
    "odo_unit" "odoUnit" NOT NULL DEFAULT 'MILES',
    "currency" "Currency" NOT NULL DEFAULT 'PKR',
    "status" "ClassifiedStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classifieds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "makes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "makes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "make_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_variants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model_id" INTEGER NOT NULL,
    "yearStart" INTEGER NOT NULL,
    "yearEnd" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "model_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_lifecycle" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "old_status" "CustomerStatus" NOT NULL,
    "new_status" "CustomerStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_lifecycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "status" "CustomerStatus" NOT NULL DEFAULT 'INTRESTED',
    "classified_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "classified_id" INTEGER NOT NULL,
    "blurHash" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classifieds_slug_key" ON "classifieds"("slug");

-- CreateIndex
CREATE INDEX "index_make_model" ON "classifieds"("make_id", "model_id");

-- CreateIndex
CREATE INDEX "index_status" ON "classifieds"("status");

-- CreateIndex
CREATE INDEX "index_price" ON "classifieds"("price");

-- CreateIndex
CREATE UNIQUE INDEX "makes_name_key" ON "makes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "models_name_make_id_key" ON "models"("name", "make_id");

-- CreateIndex
CREATE UNIQUE INDEX "model_variants_name_model_id_key" ON "model_variants"("name", "model_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_lifecycle_customerId_key" ON "customer_lifecycle"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "page_views_path_viewed_at_idx" ON "page_views"("path", "viewed_at");

-- AddForeignKey
ALTER TABLE "classifieds" ADD CONSTRAINT "classifieds_make_id_fkey" FOREIGN KEY ("make_id") REFERENCES "makes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifieds" ADD CONSTRAINT "classifieds_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifieds" ADD CONSTRAINT "classifieds_model_variat_id_fkey" FOREIGN KEY ("model_variat_id") REFERENCES "model_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_make_id_fkey" FOREIGN KEY ("make_id") REFERENCES "makes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_variants" ADD CONSTRAINT "model_variants_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_lifecycle" ADD CONSTRAINT "customer_lifecycle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_classified_id_fkey" FOREIGN KEY ("classified_id") REFERENCES "classifieds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_classified_id_fkey" FOREIGN KEY ("classified_id") REFERENCES "classifieds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
