import { useState, useEffect } from 'react';

// This is the expected shape of the response from your FastAPI endpoint
type TagsMap = Record<number, string[]>;

export function useBatchTags(docIds: number[]) {
  const [tagsMap, setTagsMap] = useState<TagsMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This effect runs whenever the list of document IDs changes
  useEffect(() => {
    // Don't fetch if there are no IDs
    if (docIds.length === 0) {
      setTagsMap({}); // Clear previous tags if docs are cleared
      return;
    }

    const fetchBatchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct the URL with query parameters
        const params = new URLSearchParams();
        docIds.forEach(id => params.append('ids', String(id)));
        
        // Replace with your actual API base URL
        const response = await fetch(`/api/batch-tags/?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }

        const data: TagsMap = await response.json();
        setTagsMap(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBatchTags();
    // Use JSON.stringify to prevent re-running the effect if the array reference changes but the content is the same
  }, [JSON.stringify(docIds)]);

  // Function to add a tag locally without a full refetch
  const addLocalTag = (docId: number, newTag: string) => {
    setTagsMap((prevMap) => ({
      ...prevMap,
      [docId]: [...(prevMap[docId] || []), newTag],
    }));
  };

  // Function to remove a tag locally without a full refetch
  const removeLocalTag = (docId: number, tagToRemove: string) => {
    setTagsMap((prevMap) => ({
      ...prevMap,
      [docId]: (prevMap[docId] || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  return { tagsMap, loading, error, addLocalTag, removeLocalTag };
}