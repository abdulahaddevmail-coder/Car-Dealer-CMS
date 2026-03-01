import { HeroSection } from "./_components/hero-section";
import { LatestArrivals } from "./_components/latest-arrivals";
import { FeaturesSection } from "./_components/features-section";
import { OurBrandsSection } from "./_components/our-brands-section";

import type { PageProps } from "../inventory/_models/interfaces";

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full min-h-screen bg-background">
      <HeroSection searchParams={searchParams} />
      <FeaturesSection />
      <LatestArrivals />
      <OurBrandsSection />
    </div>
  );
}
