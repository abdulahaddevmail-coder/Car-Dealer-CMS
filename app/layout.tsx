import type { Metadata } from "next";
import { Mulish, Roboto } from "next/font/google";

import { cn } from "@/lib/utils";

import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const mulish = Mulish({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
});

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DriveFlow",
    template: "%s | DriveFlow",
  },
  description: "DriveFlow is a car dealership platform that streamlines inventory management with smart automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased overscroll-none bg-background font-heading", roboto.variable, mulish.variable)}>
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
