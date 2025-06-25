import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINT } from '@/lib/utils';

// Define the shape of the return value for better type safety
interface UseTagsReturn {
  tags: string[];
  loading: boolean;
  error: string | null;
  addLocalTag: (tag: string) => void;
  removeLocalTag: (tag:string) => void;
  refetchTags: () => void;
}

/**
 * A custom hook to fetch and manage tags for a specific drawing.
 * @param drawingId - The ID of the drawing to fetch tags for.
 */
export function useTags(drawingId: number | null): UseTagsReturn {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize the fetch function.
  // It will only be recreated if drawingId changes.
  const fetchTags = useCallback(async () => {
    // Prevent fetching if there's no ID
    if (!drawingId) {
      setTags([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null); // Reset error on new fetch

    try {
      const res = await fetch(`${API_ENDPOINT}/api/tags/${drawingId}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch tags: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setTags(data);

      console.log(`Fetching tags for drawing ID: ${drawingId}, TAGS: ${data}`); // Debug log
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [drawingId]); // Dependency array ensures the function updates when drawingId changes

  // Use useEffect to trigger the fetch when the component mounts or drawingId changes.
  useEffect(() => {
    fetchTags();
  }, [fetchTags]); // The effect depends on the memoized fetchTags function

  /**
   * Allows a component to add a new tag to the local state without a full refetch.
   * This is useful for "optimistic updates" after a successful POST request.
   */
  const addLocalTag = (newTag: string) => {
    setTags((currentTags) => [...currentTags, newTag]);
  };

  const removeLocalTag = (oldTag: string) => {
    setTags((currentTags) => currentTags.filter((tag) => tag !== oldTag))
  }

  return { 
    tags, 
    loading, 
    error, 
    addLocalTag,
    removeLocalTag,
    refetchTags: fetchTags // Expose the fetch function for manual refetching
  };
}