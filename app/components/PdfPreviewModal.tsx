// src/components/PdfPreviewModal.tsx
import React from "react";

interface PdfPreviewModalProps {
  pdfUrl: string;
  onClose: () => void;
}

export function PdfPreviewModal({ pdfUrl, onClose }: PdfPreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey bg-opacity-60 backdrop-blur-sm">
      <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 m-2 text-2xl bg-red-500 font-white text-white rounded hover:bg-red-400 transition-colors duration-200"
        >
          Close Pdf &times;
        </button>
      <div className="relative w-full h-full max-w-4xl p-4 bg-white rounded-lg shadow-xl">
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          title="PDF Preview"
        ></iframe>
      </div>
    </div>
  );
}
