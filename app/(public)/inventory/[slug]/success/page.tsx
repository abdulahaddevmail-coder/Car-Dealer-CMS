import Link from "next/link";

import { CarIcon, HomeIcon, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SuccessfulReservationPage() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CircleCheck className="mx-auto w-16 h-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Reservation Confirmed!</h1>
        <p className="mt-4 text-muted-foreground">Thank you for your reservation. We'll see you soon.</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            className="transition-colors hover:border-white hover:bg-primary hover:text-white"
            asChild
          >
            <Link href="/">
              <HomeIcon className="mr-2 h-5 w-5" /> Go to Homepage
            </Link>
          </Button>
          <Button asChild>
            <Link href="/inventory">
              <CarIcon className="mr-2 h-5 w-5" /> View Classifieds
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
