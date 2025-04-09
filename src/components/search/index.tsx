// search-component.tsx
"use client";

import { useState } from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import { searchAction, SearchSchema } from "./server";
import {
  FormProvider,
  //   Select,
  Submit,
  TagInput,
} from "@/context/form";
import { SectionHeader } from "../section-header";

const filterOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "glutenFree", label: "Gluten Free" },
];

export const SearchForm = () => {
  return (
    <FormProvider
      schema={SearchSchema}
      action={searchAction}
      className="w-full flex flex-col gap-5 p-20"
      defaultValues={{ sortBy: "relevance" }}
    >
      <SectionHeader
        title="Search Recipes"
        description="Find your perfect recipe with advanced filters"
      />

      <TagInput
        name="tags"
        placeholder="Search recipes..."
        aria-label="Search tags"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="p-4 border rounded-2xl">
          <legend className="flex items-center gap-2 mb-4 font-medium">
            <Filter size={18} /> Filters
          </legend>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox"
                defaultChecked={true}
                aria-label="Match all tags"
              />
              <span>Match all tags</span>
            </label>
            {filterOptions.map((filter) => (
              <label
                key={filter.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  aria-label={filter.label}
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* SortBy Select remains unchanged */}
      </div>

      <Submit className="...">Search</Submit>
    </FormProvider>
  );
};
