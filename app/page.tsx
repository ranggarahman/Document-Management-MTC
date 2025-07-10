// src/app/page.tsx
"use client";

// --- IMPORTS ---
import { useDocuments } from "./hooks/useDocuments";
import { SearchBar } from "./components/SearchBar";
import { useState, FormEvent } from "react"; // <-- Add FormEvent
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DocumentSearchResult from "./components/DocumentSearchResult";
import Image from "next/image";
import { UploadDocumentModal } from "./components/upload/DocumentUploadModal";
import { Document } from "@/lib/types";
import { useAuth } from "./context/AuthContext";
import { AdminLoginModal } from "./components/AdminLogin";
import { FilePlus2, UserLock } from "lucide-react";
import { toast } from "react-toastify";

export default function HomePage() {
  const { documents, loading, error, addDocumentLocally, fetchDocuments } =
    useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- AUTHENTICATION LOGIC ---
  const { login } = useAuth(); // <-- Use the context
  const [password, setPassword] = useState("");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // 2. Function to OPEN the modal
  const handleOpenAdminModal = () => {
    setIsAdminModalOpen(true);
  };

  // 3. Function to CLOSE the modal
  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    setPassword(""); // Optionally reset password on close
  };

  // 4. Form submission handler remains the same
  const handleAdminLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isLoginSuccessful = login(password); // Call context login function
    console.log("Admin password submitted:", password);
    // Add your admin login logic here
    if (isLoginSuccessful) {
      toast.success("Login Success!"); // Set an error message
      handleCloseAdminModal(); // Close modal after submission
    } else {
      console.error("Admin login failed.");
      toast.warn("Incorrect password. Please try again."); // Set an error message
      setPassword(""); // Clear the password field
    }
  };

  // ... (the rest of your functions: handleUploadSuccess, handleAddNewDocument, handleSearch)
  const handleUploadSuccess = (newDocument: Document) => {
    console.log("Upload successful, new document:", newDocument);
    addDocumentLocally(newDocument);
  };
  const handleAddNewDocument = () => {
    setIsModalOpen(true);
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(query);
    if (trimmedQuery.length >= 2) {
      fetchDocuments(trimmedQuery);
    }
  };

  return (
    <main className="min-h-screen">
      {/* ... your Tenaris Logo and Header ... */}
      <div className="w-full flex justify-between items-center">
        <Image
          src="/10aris.png"
          alt="Tenaris Logo"
          width={200}
          height={100}
          style={{ objectFit: "contain" }}
          priority
          className="w-[200px] h-[100px]"
        />
        <h2 className="text-tenaris-purple-hover text-sm pr-4">
          <strong>©️Maintenance TenarisSPIJ 👷</strong>
        </h2>
      </div>

      <div className="px-8 pb-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-tenaris-blue-dark">
            Drawing Document Management Central
          </h1>
          <p className="mt-2 text-lg text-tenaris-gray-dark">
            Find Document... 📝
          </p>
        </header>

        {/* ... your SearchBar and Add Document button ... */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <SearchBar onSearch={handleSearch} />

          <div className="flex gap-4">
            <button
              onClick={handleAddNewDocument}
              className="group flex items-center justify-center overflow-hidden rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md transition-all duration-500 ease-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {/* The Icon that is always visible */}
              <FilePlus2 className="h-6 w-6" />
              <span className="ml-2 whitespace-nowrap">Add New Document</span>
            </button>

            {/* --- Admin Access Button --- */}
            <div>
              {/* --- Admin Access Button --- */}
              {/* 5. Use the correct onClick handler */}
              <button
                onClick={handleOpenAdminModal}
                className="group flex items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-all duration-500 ease-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <UserLock className="h-6 w-6" />
                <span className="ml-0 max-w-0 group-hover:max-w-xs whitespace-nowrap opacity-0 transition-all duration-500 ease-out group-hover:ml-2 group-hover:opacity-100">
                  Admin Access
                </span>
              </button>

              {/* --- Admin Login Modal --- */}
              <AdminLoginModal
                isOpen={isAdminModalOpen}
                onClose={handleCloseAdminModal}
                handleAdminLogin={handleAdminLogin}
                password={password}
                setPassword={setPassword}
              />
            </div>
          </div>
        </div>

        {/* ... your Modal, DocumentSearchResult, and ToastContainer ... */}
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
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </main>
  );
}
