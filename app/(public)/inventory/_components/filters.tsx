"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { env } from "@/env";
import { parseAsString, useQueryStates } from "nuqs";

import {
  BodyType,
  Color,
  Currency,
  FuelType,
  OdoUnit,
  Transmision,
  ULEZCompliance,
} from "@/lib/generated/prisma/browser";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/common/select-input";
import { SearchInput } from "@/components/common/search-input";
import { RangeFilter } from "../../../../components/common/range-filters";
import { TaxonomyFilters } from "../../../../components/common/taxonomy-filters";

import { cn, formatOdometerUnit, formatText } from "@/lib/utils";

import type { ISidebarProps } from "../../_constants/interfaces";

type IProps = ISidebarProps & {
  force?: boolean;
  // count?: number;
  // onClose?: (value: boolean) => void;
};

export const Filters = ({ minMaxValues, searchParams, force = false }: IProps) => {
  //count = 0, onClose
  const router = useRouter();
  const { _min, _max } = minMaxValues;

  const [filterCount, setFilterCount] = useState(0);

  const [queryStates, setQueryStates] = useQueryStates(
    {
      make: parseAsString.withDefault(""),
      model: parseAsString.withDefault(""),
      modelVariant: parseAsString.withDefault(""),
      minYear: parseAsString.withDefault(""),
      maxYear: parseAsString.withDefault(""),
      minPrice: parseAsString.withDefault(""),
      maxPrice: parseAsString.withDefault(""),
      minReading: parseAsString.withDefault(""),
      maxReading: parseAsString.withDefault(""),
      currency: parseAsString.withDefault(""),
      odoUnit: parseAsString.withDefault(""),
      transmision: parseAsString.withDefault(""),
      fuelType: parseAsString.withDefault(""),
      bodyType: parseAsString.withDefault(""),
      color: parseAsString.withDefault(""),
      doors: parseAsString.withDefault(""),
      seats: parseAsString.withDefault(""),
      ulezCompliance: parseAsString.withDefault(""),
    },
    {
      shallow: false,
    },
  );

  useEffect(() => {
    const filterCount = Object.entries(searchParams as Record<string, string>).filter(
      ([key, value]) => key !== "page" && value,
    ).length;

    setFilterCount(filterCount);
  }, [searchParams]);

  const clearFilters = () => {
    const url = new URL("/inventory", env.NEXT_PUBLIC_APP_URL);
    window.location.replace(url.toString());
    setFilterCount(0);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setQueryStates({
      [name]: value || null,
    });

    if (name === "make") {
      setQueryStates({
        model: null,
        modelVariant: null,
      });
    }

    // router.refresh();
  };

  return (
    // sticky top-1 h-screen overflow-y-auto
    <div className={`bg-white ${force ? "pb-4" : "w-85 py-4 hidden lg:block border-r border-muted h-fit"}`}>
      {!force && (
        <div>
          <div className="text-lg font-semibold flex justify-between px-4">
            <span>Filters</span>
            <button
              type="button"
              onClick={clearFilters}
              aria-disabled={!filterCount}
              className={cn(
                "text-sm text-gray-500 py-1",
                !filterCount
                  ? "disabled opacity-50 pointer-events-none cursor-default"
                  : "hover:underline cursor-pointer",
              )}
            >
              Clear all {filterCount ? `(${filterCount})` : null}
            </button>
          </div>
          <div className="mt-2" />
        </div>
      )}
      <div className="p-4">
        <SearchInput
          placeholder="Search classifieds..."
          className="w-full px-3 py-2 border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="p-4 space-y-2">
        <TaxonomyFilters searchParams={searchParams} handleChange={handleChange} />

        <RangeFilter
          label="Year"
          minName="minYear"
          maxName="maxYear"
          defaultMin={_min.year || 1925}
          defaultMax={_max.year || new Date().getFullYear()}
          handleChange={handleChange}
          searchParams={searchParams}
        />
        <RangeFilter
          label="Price"
          minName="minPrice"
          maxName="maxPrice"
          defaultMin={_min.price || 0}
          defaultMax={_max.price || 21474836}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={1000000}
          thousandSeparator
          currency={{
            currencyCode: "PKR",
          }}
        />
        <RangeFilter
          label="Odometer Reading"
          minName="minReading"
          maxName="maxReading"
          defaultMin={_min.odoReading || 0}
          defaultMax={_max.odoReading || 1000000}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={5000}
          thousandSeparator
        />
        <Select
          label="Currency"
          name="currency"
          value={queryStates.currency || ""}
          onChange={handleChange}
          options={Object.values(Currency).map((value) => ({
            label: value,
            value,
          }))}
        />
        <Select
          label="Odometer Unit"
          name="odoUnit"
          value={queryStates.odoUnit || ""}
          onChange={handleChange}
          options={Object.values(OdoUnit).map((value) => ({
            label: formatOdometerUnit(value),
            value,
          }))}
        />
        <Select
          label="Transmission"
          name="transmision"
          value={queryStates.transmision || ""}
          onChange={handleChange}
          options={Object.values(Transmision).map((value) => ({
            label: formatText(value),
            value,
          }))}
        />
        <Select
          label="Fuel Type"
          name="fuelType"
          value={queryStates.fuelType || ""}
          onChange={handleChange}
          options={Object.values(FuelType).map((value) => ({
            label: formatText(value),
            value,
          }))}
        />
        <Select
          label="Body Type"
          name="bodyType"
          value={queryStates.bodyType || ""}
          onChange={handleChange}
          options={Object.values(BodyType).map((value) => ({
            label: formatText(value),
            value,
          }))}
        />
        <Select
          label="Color"
          name="color"
          value={queryStates.color || ""}
          onChange={handleChange}
          options={Object.values(Color).map((value) => ({
            label: formatText(value),
            value,
          }))}
        />
        <Select
          label="ULEZ Compliance"
          name="ulezCompliance"
          value={queryStates.ulezCompliance || ""}
          onChange={handleChange}
          options={Object.values(ULEZCompliance).map((value) => ({
            label: formatText(value),
            value,
          }))}
        />

        <Select
          label="Doors"
          name="doors"
          value={queryStates.doors || ""}
          onChange={handleChange}
          options={Array.from({ length: 6 }).map((_, i) => ({
            label: Number(i + 1).toString(),
            value: Number(i + 1).toString(),
          }))}
        />

        <Select
          label="Seats"
          name="seats"
          value={queryStates.seats || ""}
          onChange={handleChange}
          options={Array.from({ length: 8 }).map((_, i) => ({
            label: Number(i + 1).toString(),
            value: Number(i + 1).toString(),
          }))}
        />
      </div>
      {force && (
        <div className="px-4 flex flex-col space-y-2">
          {/* <Button type="button" onClick={() => onClose && onClose(false)} className="w-full">
            Search{count > 0 ? ` (${count})` : null}
          </Button> */}
          {filterCount > 0 && (
            <Button
              type="button"
              // variant="outline"
              onClick={clearFilters}
              aria-disabled={!filterCount}
              className={cn(
                "text-sm py-1",
                !filterCount ? "disabled opacity-50 pointer-events-none cursor-default" : "hover:underline",
              )}
            >
              Clear all {filterCount ? `(${filterCount})` : null}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
