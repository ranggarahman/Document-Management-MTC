// src/components/PdfTable.tsx
import React, { useState, useMemo } from "react";
import { Document } from "@/lib/types";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { DocumentRow } from "./DocumentRow";
import {
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { FilterControls } from "./FilterControls";

type SortKey = keyof Document;
type SortDirection = "ascending" | "descending";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface PdfTableProps {
  documents: Document[];
}

export function PdfTable({ documents }: PdfTableProps) {
  const [selectedPdf, setSelectedPdf] = useState<Document | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: "title",
    direction: "ascending",
  });
  const [filters, setFilters] = useState({
    discipline: "",
    contractors: "",
  });

  // --- Data Processing (Memoized for Performance) ---
  const uniqueDisciplines = useMemo(
    () =>
      [...new Set(documents.map((doc) => doc.discipline))]
        .filter((d): d is string => typeof d === "string" && d.length > 0),
    [documents]
  );
  const uniqueContractors = useMemo(
    () =>
      [...new Set(documents.map((doc) => doc.contractors))]
        .filter((c): c is string => typeof c === "string" && c.length > 0),
    [documents]
  );

  const processedDocuments = useMemo(() => {
    let filteredDocs = [...documents];

    // Apply filters
    if (filters.discipline) {
      filteredDocs = filteredDocs.filter(
        (doc) => doc.discipline === filters.discipline
      );
    }
    if (filters.contractors) {
      filteredDocs = filteredDocs.filter(
        (doc) => doc.contractors === filters.contractors
      );
    }

    // Apply sorting
    if (sortConfig !== null) {
      filteredDocs.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue == null || bValue == null) return 0;
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return filteredDocs;
  }, [documents, filters, sortConfig]);

  // --- Event Handlers ---
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => setFilters({ discipline: "", contractors: "" });

  // --- UI Helper for Sort Icons ---
  const SortIndicator = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key !== columnKey) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    if (sortConfig.direction === "ascending") {
      return <ChevronUp className="h-4 w-4" />;
    }
    return <ChevronDown className="h-4 w-4" />;
  };

  // Helper to make headers cleaner
  const SortableHeader = ({
    columnKey,
    title,
    className,
  }: {
    columnKey: SortKey;
    title: string;
    className: string;
  }) => (
    <th
      className={`${className} cursor-pointer group`}
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-2">
        {title}
        <SortIndicator columnKey={columnKey} />
      </div>
    </th>
  );

  return (
    <>
      <FilterControls
        filters={filters}
        uniqueDisciplines={uniqueDisciplines}
        uniqueContractors={uniqueContractors}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow mt-4">
        <table className="min-w-full text-left text-tenaris-gray-dark table-fixed">
          <thead className="border-b bg-tenaris-blue border-red-500">
            <tr>
              <SortableHeader
                columnKey="title"
                title="Name"
                className="px-6 py-4 w-[20%]"
              />
              <th className="px-6 py-4 w-[7.5%]">File Type</th>
              <th className="px-6 py-4 w-[27.5%]">Description</th>
              <th className="px-6 py-4 w-[30%]">Tags</th>
              <th className="px-6 py-4 w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedDocuments.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                onPreviewClick={setSelectedPdf}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedPdf && (
        <PdfPreviewModal
          doc={selectedPdf}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </>
  );
}
