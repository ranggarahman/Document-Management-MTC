import { useState } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINT } from "@/lib/utils";
import { Document } from "@/lib/types";

// This interface defines the object of data we'll pass from the form
export interface DocumentFormData {
  drawingName: string;
  description: string;
  discipline: string;
  contractors: string;
  createdBy: string;
}

interface UseUploadDocumentResult {
  uploadDocument: (file: File, data: DocumentFormData) => Promise<number>;
  isLoading: boolean;
  error: string | null;
}

// The hook accepts a callback function to run on success
export function useUploadDocument(
  onUploadSuccess: (newDocument: Document) => void
): UseUploadDocumentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (
    file: File,
    data: DocumentFormData
  ): Promise<number > => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();

    // These keys MUST match your FastAPI Form(...) parameters
    formData.append("file", file);
    formData.append("drawing_name", data.drawingName);
    formData.append("description", data.description);
    formData.append("discipline", data.discipline);
    formData.append("contractors", data.contractors);
    formData.append("created_by", data.createdBy);

    try {
      const response = await fetch(`${API_ENDPOINT}/api/documents/upload`, {
        method: "POST",
        body: formData,
        // No 'Content-Type' header needed, browser handles it
      });

      const result = await response.json();

      if (!response.ok) {
        // Use the error from FastAPI's `detail` field
        throw new Error(result.detail || "An unknown error occurred during upload.");
      }
      
      // The `result` object is now a valid `Document` according to your new interface
      toast.success(`'${result.title}' uploaded successfully!`);
      
      // Trigger the success callback with the full document object
      onUploadSuccess(result);
      
       // NEW: Return the ID from the successful result object
      return result.id;

    } catch (err: unknown) {
      let errorMessage = "Failed to upload file.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(`ERROR: '${errorMessage}'`);
      return 0; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadDocument, isLoading, error };
}