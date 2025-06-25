// src/app/page.tsx
"use client";

import { useDocuments } from "./hooks/useDocuments";
import { SearchBar } from "./components/SearchBar";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DocumentSearchResult from "./components/DocumentSearchResult";
import Image from "next/image";
import { UploadDocumentModal } from "./components/upload/DocumentUploadModal";
import { Document } from "@/lib/types";

export default function HomePage() {
  const { documents, loading, error, addDocumentLocally, fetchDocuments } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  //const toastId = useRef<string | number | null>(null); // To keep track of the toast ID

  // --- STATE FOR THE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- A FUNCTION TO REFRESH DATA AFTER UPLOAD ---
  // In a real app, this would re-fetch the list of documents
  const handleUploadSuccess = (newDocument: Document) => {
    console.log("Upload successful, new document:", newDocument);
    // Optimistically update the UI
    addDocumentLocally(newDocument);
    // You could still trigger a full refetch if needed, e.g., to re-sort the list
    // fetchDocuments(currentSearchTerm); 
  };

  const handleAddNewDocument = () => {
    setIsModalOpen(true); 
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();

    // Optional: only trigger if it's at least 2 characters long
    const isValidQuery = trimmedQuery.length >= 2;

    // Save the raw input (useful for UI binding)
    setSearchQuery(query);

    // Only fetch if it’s a valid search term
    if (isValidQuery) {
      fetchDocuments(trimmedQuery);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="w-full flex justify-between items-center">
        <Image
          src="/10aris.png"
          alt="Tenaris Logo"
          width={200}
          height={50}
          style={{ objectFit: "contain" }}
          priority
          className="w-[200px] h-[50px]"
        />
        <h2 className="text-tenaris-purple-hover text-sm">
          <strong>©️Maintenance TenarisSPIJ</strong>
        </h2>
      </div>

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-tenaris-blue-dark">
          Drawing Document Management Central
        </h1>
        <p className="mt-2 text-lg text-tenaris-gray-dark">
          Find Document... 📝
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={handleAddNewDocument}
          className="whitespace-nowrap rounded-lg bg-green-600 px-6 py-2 font-semibold text-white shadow-md transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add New Document
        </button>
      </div>

      {/* --- RENDER THE MODAL --- */}
      <UploadDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <DocumentSearchResult
        loading={loading}
        error={error ?? undefined}
        documents={documents}
        searchQuery={searchQuery}
      />

      <ToastContainer
        position="top-right" // You can change the position
        autoClose={3000} // How long toasts stay
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  );
}
