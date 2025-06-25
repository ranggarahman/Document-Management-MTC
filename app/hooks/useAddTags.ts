// src/hooks/useAddTag.ts (or utils/useAddTag.ts, choose a suitable directory)
import { useState } from "react";
import { API_ENDPOINT } from "@/lib/utils";

interface UseAddTagResult {
  addTag: (drawingId: number, tag: string) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
}

export function useAddTag(): UseAddTagResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTag = async (drawingId: number, tag: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_ENDPOINT}/api/tags/${drawingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });

      if (!res.ok) {
        const errorData = await res.json(); // Assuming API sends error details
        throw new Error(errorData.message || "Failed to add tag");
      }

      return true; // Tag added successfully
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("An unknown error occurred"));
      }
      return false; // Failed to add tag
    } finally {
      setIsLoading(false);
    }
  };

  return { addTag, isLoading, error };
}
