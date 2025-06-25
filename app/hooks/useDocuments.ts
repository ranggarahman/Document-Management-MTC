import { useCallback, useState, useRef } from "react";
import { Document } from '@/lib/types'; // Assuming your type import
import { API_ENDPOINT } from "@/lib/utils";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // The core fetching logic is updated here.
  const fetchDocuments = useCallback(async (searchQuery = "") => {
    // This function is now called AFTER the debounce timer.
    setLoading(true);
    setError(null); // Always clear previous errors on a new search.

    try {
      // If the search query is empty, clear the results and stop.
      if (searchQuery.trim() === "") {
        setDocuments([]);
        return; // Exit early
      }

      // --- Start of the new logic ---

      // 1. Create the API call promise.
      const apiCallPromise = fetch(
        `${API_ENDPOINT}/api/documents?search=${searchQuery}`
      ).then(res => {
        // Add robust error handling for bad HTTP responses
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        return res.json();
      });

      // 2. Create the 1-second minimum delay promise.
      const minDisplayTimePromise = new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Use Promise.all to wait for both to complete.
      // The `await` will pause here until the API call is finished AND 1 second has passed.
      const [data] = await Promise.all([apiCallPromise, minDisplayTimePromise]);

      setDocuments(data);
      
      // --- End of the new logic ---

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setDocuments([]); // Also clear documents on error for a clean state.
    } finally {
      // This `finally` block will only run after the `try/catch` is complete,
      // which is after the `Promise.all` has resolved.
      setLoading(false);
    }
  }, []); // useCallback has no dependencies as it only uses setter functions.

  // Your debounce implementation is perfect and does not need to change.
  const debounceFetchDocuments = useCallback(
    (searchQuery: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fetchDocuments(searchQuery);
      }, 500); // 500ms debounce
    },
    [fetchDocuments] // It correctly depends on the memoized fetchDocuments
  );

  /**
   * Adds a document to the local state without a network request.
   * This is useful for making the UI feel responsive after an upload.
   * It prepends the new document to the list.
   */
  const addDocumentLocally = (newDocument: Document) => {
    setDocuments((currentDocs) => [newDocument, ...currentDocs]);
  };

  // We continue to export the debounced version.
  return { documents, loading, error, addDocumentLocally, fetchDocuments: debounceFetchDocuments };
}