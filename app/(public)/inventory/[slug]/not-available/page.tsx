import Link from "next/link";

import { CarIcon, HomeIcon, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotAvailablePage() {
  return (
    <div className="flex items-center justify-center min-h-[80dvh]">
      <div className="flex flex-col items-center p-8 space-y-4">
        <XCircle className="w-16 h-16 text-muted-foreground" />
        <p className="text-lg font-semibold text-center">Sorry, that vehicle is no longer available.</p>
        <p className="text-center text-muted-foreground">
          We have a large number of other vehicles that might suit your needs, to view our current stock please check
          our website.
        </p>
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
