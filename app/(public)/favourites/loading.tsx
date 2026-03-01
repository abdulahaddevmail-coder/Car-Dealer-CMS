import { ClassifiedCardSkeleton } from "../_components/classified-card-skeleton";

export default function FavouritesLoadingPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[80dvh]">
      <h1 className="text-3xl font-bold mb-6">Your Favourite Classifieds</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, index) => index + 1).map((id) => (
          <ClassifiedCardSkeleton key={id} />
        ))}
      </div>
    </div>
  );
}
