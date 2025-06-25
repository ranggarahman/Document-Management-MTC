import { useState } from "react";
import { API_ENDPOINT } from "@/lib/utils";

interface UseDeleteTagResult {
  /**
   * Function to delete a tag from a specific drawing.
   * @param drawingId The ID of the drawing.
   * @param tag The name of the tag to delete.
   * @returns A promise that resolves to `true` on success, `false` on failure.
   */
  deleteTag: (drawingId: number, tag: string) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
}

export function useDeleteTag(): UseDeleteTagResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteTag = async (drawingId: number, tag: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // The URL now includes both the drawingId and the tag name
      // We also use encodeURIComponent on the tag to handle special characters safely
      const res = await fetch(`${API_ENDPOINT}/api/tags/${drawingId}/${encodeURIComponent(tag)}`, {
        method: "DELETE",
        // Headers are optional for a DELETE request with no body, but good to have
        headers: { "Content-Type": "application/json" },
        // No body is needed for this request
      });

      if (!res.ok) {
        // Your FastAPI backend returns errors in a {"detail": "..."} object
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to delete tag");
      }

      return true; // Tag deleted successfully
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("An unknown error occurred while deleting the tag"));
      }
      return false; // Failed to delete tag
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTag, isLoading, error };
}