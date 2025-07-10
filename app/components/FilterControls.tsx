// components/FilterControls.tsx
import React from "react";
import { Filter, X } from "lucide-react";

// Define the shape of the filters state object
interface Filters {
  discipline: string;
  contractors: string;
}

// Define the props for our new reusable component
interface FilterControlsProps {
  filters: Filters;
  uniqueDisciplines: string[];
  uniqueContractors: string[];
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClearFilters: () => void;
}

export function FilterControls({
  filters,
  uniqueDisciplines,
  uniqueContractors,
  onFilterChange,
  onClearFilters,
}: FilterControlsProps) {
  return (
    // The main container that pushes the filter bar to the right
    <div className="flex justify-end mt-8">
      <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 border">
        <Filter className="h-5 w-5 text-gray-500" />
        <span className="font-semibold text-gray-700">Filter by:</span>
        <select
          name="discipline"
          value={filters.discipline}
          onChange={onFilterChange}
          className="p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
        >
          <option value="">All Disciplines</option>
          {uniqueDisciplines.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          name="contractors"
          value={filters.contractors}
          onChange={onFilterChange}
          className="p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
        >
          <option value="">All Contractors</option>
          {uniqueContractors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={onClearFilters}
          title="Clear filters"
          className="p-2 text-gray-500 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
