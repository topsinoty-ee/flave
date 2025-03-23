"use client";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components";

export const Hero = () => {
  return (
    <section className="aspect-[64/27] flex w-full p-10 bg-foreground rounded-lg">
      <div className="flex flex-col w-full h-full rounded-md filter justify-evenly">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold uppercase text-7xl">
            <span>
              Meal-planning
              <br /> with{" "}
              <span className="text-white">
                ingredients <br /> at home
              </span>
            </span>
          </h1>
        </div>
        <div className="flex gap-5">
          <Button
            icon={<ArrowRight className="stroke-white " />}
            className="text-white transition-transform duration-500 bg-black shadow-md outline-0 hover:-translate-y-1"
            variant="secondary"
            as="link"
            href="/recipes/create"
          >
            Get started
          </Button>
          <Button
            className="transition-transform duration-500 bg-white shadow-md outline-0 hover:-translate-y-1 "
            variant="none"
            as="link"
            href="/recipes/browse"
          >
            Browse recipes
          </Button>
        </div>
      </div>
    </section>
  );
};
