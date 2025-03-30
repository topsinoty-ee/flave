"use client";

import { FormProvider, createAction } from "@/context/form";
import { z } from "zod";
import { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { RecipeCardProps } from "./recipe/card/index";
import { API } from "@/api/main";
import { FormHeader, FormInput, SubmitButton } from "@/context/form/components";

const SearchSchema = z.object({
  query: z.string(),
  filters: z.record(z.boolean()).optional(),
  sortBy: z.enum(["relevance", "date", "rating"]).optional(),
});

export const SearchForm = () => {
  const [isSearching, setIsSearching] = useState(false);

  const searchAction = createAction<
    z.infer<typeof SearchSchema>,
    RecipeCardProps[]
  >(SearchSchema, async (formData) => {
    try {
      setIsSearching(true);
      const { query, filters, sortBy } = formData;

      const params = new URLSearchParams();

      // Add search query
      if (query) {
        const searchTerms = query.split(/[\s,]+/).filter(Boolean);
        searchTerms.forEach((term) => params.append("tags", term));
      }

      // Add sorting
      if (sortBy) params.append("sort", sortBy);

      // Add filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, "true");
        });
      }

      //   console.log(params);
      const data = await API.get<RecipeCardProps[]>(
        `https://api.flave.ee/recipes/search?${params}`
      );
      //   console.log(data);

      return {
        success: true,
        message: "Search successful",
        data,
      };
    } catch (error) {
      let errorMessage = "Search failed. Please try again.";
      if (error instanceof Error) {
        console.log(error);
        errorMessage = error.message;
      }
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsSearching(false);
    }
  });

  const filterOptions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "glutenFree", label: "Gluten Free" },
  ];

  return (
    <FormProvider
      schema={SearchSchema}
      action={searchAction}
      className="w-full flex flex-col gap-5 p-20"
      defaultValues={{ sortBy: "relevance" }}
    >
      <FormHeader
        title="Search Recipes"
        description="Find your perfect recipe with advanced filters"
      />

      <FormInput
        name="query"
        placeholder="Search recipes..."
        icon={Search}
        aria-label="Search input"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="p-4 border rounded-lg">
          <legend className="flex items-center gap-2 mb-4 font-medium">
            <Filter size={18} /> Filters
          </legend>
          <div className="space-y-2">
            {filterOptions.map((filter) => (
              <label
                key={filter.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={`filters.${filter.id}`}
                  className="checkbox"
                  aria-label={filter.label}
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="p-4 border rounded-lg">
          <h3 className="flex items-center gap-2 mb-4 font-medium">
            <ArrowUpDown size={18} /> Sort By
          </h3>
          {/* <FormInput
            name="sortBy"
            type="select"
            options={[
              { value: "relevance", label: "Relevance" },
              { value: "date", label: "Newest First" },
              { value: "rating", label: "Highest Rated" },
            ]}
            aria-label="Sort recipes by"
          /> */}
        </div>
      </div>

      <SubmitButton
        loading={isSearching}
        className="w-full py-3 font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors"
      >
        {isSearching ? "Searching..." : "Search Recipes"}
      </SubmitButton>
    </FormProvider>
  );
};
