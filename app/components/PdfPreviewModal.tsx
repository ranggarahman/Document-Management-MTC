import React from "react";
import { Document } from "@/lib/types";
import { extractPdfPath } from "@/lib/types";

interface PdfPreviewModalProps {
  doc: Document;
  onClose: () => void;
}

// Helper function to format bytes into KB, MB, GB, etc.
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Helper function to format the date string
const formatDate = (dateString: string): string => {
  try {
    // Changed "en-US" to "id-ID" for Indonesian formatting
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString; // Fallback to original string if format is invalid
  }
};

export function PdfPreviewModal({ doc, onClose }: PdfPreviewModalProps) {
  // A detail item component for cleaner code
  const DetailItem = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null; // Don't render if the value is not provided
    return (
      <div>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className="text-base text-gray-800">{value}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto p-4 justify-center bg-grey bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-7xl p-4 bg-white rounded-lg shadow-xl m-4 flex flex-col md:flex-row gap-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-gray-600 text-white transition-colors duration-200 hover:bg-red-500"
        >
          X
        </button>

        {/* Left Pane: PDF Preview */}
        <div className="flex-1 w-full md:w-2/3 h-1/2 md:h-full">
          <iframe
            src={extractPdfPath(doc.path)}
            width="100%"
            height="100%"
            title="PDF Preview"
            className="border rounded-md"
          ></iframe>
        </div>

        {/* Right Pane: Document Details */}
        <div className="md:w-1/3 h-1/2 md:h-full p-4 overflow-y-auto border-l border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{doc.title}</h2>
          {doc.description && (
            <p className="text-gray-600 mb-6">{doc.description}</p>
          )}

          <div className="space-y-4">
            <DetailItem label="File Size" value={formatBytes(doc.size)} />
            <DetailItem
              label="Created Date"
              value={formatDate(doc.created_at)}
            />
            <DetailItem label="Author" value={doc.CreatedBy} />
            <DetailItem label="Discipline" value={doc.discipline} />
            <DetailItem label="Contractors" value={doc.contractors} />
          </div>
        </div>
      </div>
    </div>
  );
}
