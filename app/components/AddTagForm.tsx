import { useState, useRef, useEffect } from "react";
import { useAddTag } from "../hooks/useAddTags";
import { toast } from 'react-toastify'; // Import toast

export function AddTagForm({
  drawingId,
  onTagAdded,
}: {
  drawingId: number;
  onTagAdded: (tag: string) => void;
}) {
  const [tagInput, setTagInput] = useState("");
  const { addTag, isLoading, error } = useAddTag();
  const toastId = useRef<string | number | null>(null); // To keep track of the toast ID

  // Use useEffect to react to changes in isLoading and error
  useEffect(() => {
    if (isLoading) {
      // Show loading toast if not already shown
      if (!toastId.current) {
        toastId.current = toast.loading("Adding tag...", {
          position: "top-right",
          autoClose: false, // Keep it open until resolved
          closeButton: false, // No close button for loading
        });
      } else {
        // Update existing toast if it's already showing
        toast.update(toastId.current, { render: "Adding tag...", type: "info", isLoading: true });
      }
    } else {
      // If not loading, and there's a toast, update it to success or error
      if (toastId.current) {
        if (error) {
          toast.update(toastId.current, {
            render: `Failed to add tag: ${error.message}`,
            type: "error",
            isLoading: false,
            autoClose: 5000, // Close error toast after 5 seconds
            closeButton: true,
          });
        } else if (toastId.current && !isLoading) { // This condition will be true after success
          // If no error, it means success (handled by handleSubmit for immediate success)
          // We need to ensure this doesn't fire if the component unmounts quickly after success
          // The success toast is better handled directly in handleSubmit for immediate feedback
        }
      }
    }
  }, [isLoading, error]); // Re-run when isLoading or error changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) {
      toast.warn("Tag cannot be empty!");
      return;
    }

    const success = await addTag(drawingId, tagInput);

    if (success) {
      onTagAdded(tagInput);
      setTagInput("");
      // Update the loading toast to success, or create a new one if it didn't exist
      if (toastId.current) {
        toast.update(toastId.current, {
          render: "Tag added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      } else {
        toast.success("Tag added successfully!"); // Fallback if no loading toast was initiated
      }
      toastId.current = null; // Reset the ref
    } else {
      // Error is handled by the useEffect for persistence
      // console.error("Failed to add tag:", error?.message || "Unknown error"); // This is now handled by toast
      // The error toast is shown via the useEffect
      if (!toastId.current && error) { // If for some reason the error happened without a loading toast
        toast.error(`Failed to add tag: ${error.message || "Unknown error"}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Add tag"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        className="border border-gray-300 px-2 py-1 rounded text-sm"
        disabled={isLoading} // Disable input while loading
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Adding..." : "Add"}
      </button>
      {/* Error message can still be here if you want it below the form,
          but toast is usually sufficient. */}
      {/* {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>} */}
    </form>
  );
}