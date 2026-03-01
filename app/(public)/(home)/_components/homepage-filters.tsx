"use client";

import { RangeFilter } from "@/components/common/range-filters";
import { TaxonomyFilters } from "@/components/common/taxonomy-filters";
import { parseAsString, useQueryStates } from "nuqs";
import { ISidebarProps } from "../../_constants/interfaces";

interface HomepageTaxonomyFiltersProps extends ISidebarProps {}
export const HomepageTaxonomyFilters = ({ searchParams, minMaxValues }: HomepageTaxonomyFiltersProps) => {
  const { _min, _max } = minMaxValues;
  const [, setState] = useQueryStates(
    {
      make: parseAsString.withDefault(""),
      model: parseAsString.withDefault(""),
      modelVariant: parseAsString.withDefault(""),
      minYear: parseAsString.withDefault(""),
      maxYear: parseAsString.withDefault(""),
      minPrice: parseAsString.withDefault(""),
      maxPrice: parseAsString.withDefault(""),
    },
    { shallow: false },
  );

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "make":
        await setState({ make: value, model: null, modelVariant: null });
        break;
      case "model":
        await setState({ model: value, modelVariant: null });
        break;
      default:
        await setState({ [name]: value });
    }
  };

  return (
    <>
      <TaxonomyFilters handleChange={handleChange} searchParams={searchParams} />
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
          currencyCode: "GBP",
        }}
      />
    </>
  );
};
