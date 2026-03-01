"use client";
import { useState } from "react";

import { Settings2 } from "lucide-react";

import { Filters } from "./filters";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader } from "@/components/ui/drawer";

import type { ISidebarProps } from "../../_constants/interfaces";

interface DialogFiltersProps extends ISidebarProps {
  count: number;
}

export const DialogFilters = ({ minMaxValues, searchParams, count }: DialogFiltersProps) => {
  const [open, setIsOpen] = useState(false);
  return (
    <Drawer open={open} onClose={() => setIsOpen(false)} direction="right">
      <DrawerTrigger>
        <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsOpen(true)}>
          <Settings2 className="size-4" />{" "}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen overflow-y-auto">
        <DrawerHeader className="pb-0">
          <div>
            <div className="text-lg font-semibold flex justify-between">
              <DialogTitle>Filters</DialogTitle>
            </div>
            <div className="mt-2" />
          </div>
        </DrawerHeader>
        <Filters force minMaxValues={minMaxValues} searchParams={searchParams} />
      </DrawerContent>
    </Drawer>
  );
};
