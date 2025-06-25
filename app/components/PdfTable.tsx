// src/components/PdfTable.tsx
import React, { useState } from "react";
import { Document } from "@/lib/types";
// import { AddTagForm } from "./AddTagForm";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { DocumentRow } from "./DocumentRow";

interface PdfTableProps {
  documents: Document[];
}

export function PdfTable({ documents }: PdfTableProps) {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  // The parent component rendering the table
  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow mt-8">
        {/* Change 1: Added `table-fixed` to enforce column widths from the header */}
        <table className="min-w-full text-left text-tenaris-gray-dark table-fixed">
          <thead className="border-b bg-tenaris-blue border-red-500">
            <tr>
              {/* Change 2: Defined widths for each column for a stable layout */}
              <th className="px-6 py-4 w-[40%]">Name</th>
              <th className="px-6 py-4 w-[15%]">Size</th>
              <th className="px-6 py-4 w-[30%]">Tags</th>
              <th className="px-6 py-4 w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
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
          pdfUrl={selectedPdf}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </>
  );
}
