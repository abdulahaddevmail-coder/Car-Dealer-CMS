"use client";

import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import { FilterOptions } from "../../app/(public)/inventory/_models/interfaces";
import { Select } from "@/components/common/select-input";

interface IProps {
  searchParams: { [key: string]: string | string[] | undefined };
  handleChange: (value: any, name?: string) => void;
}

export const TaxonomyFilters = (props: IProps) => {
  const { searchParams, handleChange } = props;

  const [makes, setMakes] = useState<FilterOptions<string, string>>([]);
  const [models, setModels] = useState<FilterOptions<string, string>>([]);
  const [modelVariants, setModelVariants] = useState<FilterOptions<string, string>>([]);

  useEffect(() => {
    (async function fetchMakesOptions() {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(searchParams as Record<string, string>)) {
        if (v) params.set(k, v as string);
      }

      const url = new URL("/api/taxonomy", window.location.href);

      url.search = params.toString();

      const data = await http.get<{
        makes: FilterOptions<string, string>;
        models: FilterOptions<string, string>;
        modelVariants: FilterOptions<string, string>;
      }>(url.toString());

      setMakes(data.makes);
      setModels(data.models);
      setModelVariants(data.modelVariants);
    })();
  }, [searchParams]);

  return (
    <>
      <Select
        label="Make"
        name="make"
        value={searchParams?.make as string}
        onChange={handleChange}
        options={makes}
        disabled={!makes.length}
      />
      <Select
        label="Model"
        name="model"
        value={searchParams?.model as string}
        options={models}
        onChange={handleChange}
        disabled={!models.length}
      />
      <Select
        label="Model Variant"
        name="modelVariant"
        value={searchParams?.modelVariant as string}
        options={modelVariants}
        onChange={handleChange}
        disabled={!modelVariants.length}
      />
    </>
  );
};
