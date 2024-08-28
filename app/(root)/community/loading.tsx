import LocalSearchbar from "@/components/shared/search/LocalSearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserFilters } from "@/constants/filters";
import { Filter } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mb-12 mt-11 flex flex-wrap items-center justify-between gap-5">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        {[1,2,3,4,5,6].map((item) => (
            <Skeleton key={item} className="size-64 rounded-2xl" />
        ))}
      </div>
    </section>
  );
};

export default loading;
