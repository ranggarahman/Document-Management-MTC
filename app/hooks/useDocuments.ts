import { useCallback, useState, useRef } from "react";
import { Document } from '@/lib/types'; // Assuming your type import
import { API_ENDPOINT } from "@/lib/utils";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // The core fetching logic remains simple, without the forced delay.
  const fetchDocuments = useCallback(async (searchQuery = "") => {
    setLoading(true);
    setError(null);

    try {
      if (searchQuery.trim() === "") {
        setDocuments([]);
        setLoading(false); // Ensure loading is turned off
        return;
      }

      const response = await fetch(
        `${API_ENDPOINT}/api/documents?search=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDocuments(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed

  // Debounce logic is added back here.
  const debounceFetchDocuments = useCallback(
    (searchQuery: string) => {
      // Clear the previous timeout if a new keystroke happens
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        fetchDocuments(searchQuery);
      }, 750); // 750ms debounce delay
    },
    [fetchDocuments] // Dependency on the memoized fetchDocuments function
  );

  /**
   * Adds a document to the local state without a network request.
   */
  const addDocumentLocally = (newDocument: Document) => {
    setDocuments((currentDocs) => [newDocument, ...currentDocs]);
  };

  // Export the debounced version for use in the UI.
  return { documents, loading, error, addDocumentLocally, fetchDocuments: debounceFetchDocuments };
}