import { useEffect, useRef } from "react";
import { useDeleteTag } from "../hooks/useDeleteTag";
import { toast } from "react-toastify"; // Import toast

interface TagProps {
  name: string;
  drawingId: number;
  /**
   * A callback function that the parent component provides.
   * It will be called with the tag name upon successful deletion.
   */
  onDelete: (tagName: string) => void;
}

export function Tag({ name, drawingId, onDelete }: TagProps) {
  const { deleteTag, isLoading, error } = useDeleteTag();
  const toastId = useRef<string | number | null>(null); // To keep track of the toast ID

  // Use useEffect to react to changes in isLoading and error
  useEffect(() => {
    if (isLoading) {
      // Show loading toast if not already shown
      if (!toastId.current) {
        toastId.current = toast.loading("Deleting tag...", {
          position: "top-right",
          autoClose: false, // Keep it open until resolved
          closeButton: false, // No close button for loading
        });
      } else {
        // Update existing toast if it's already showing
        toast.update(toastId.current, {
          render: "Deleting tag...",
          type: "info",
          isLoading: true,
        });
      }
    } else {
      // If not loading, and there's a toast, update it to success or error
      if (toastId.current) {
        if (error) {
          toast.update(toastId.current, {
            render: `Failed to Delete tag: ${error.message}`,
            type: "error",
            isLoading: false,
            autoClose: 5000, // Close error toast after 5 seconds
            closeButton: true,
          });
        } else if (toastId.current && !isLoading) {
          // This condition will be true after success
          // If no error, it means success (handled by handleSubmit for immediate success)
          // We need to ensure this doesn't fire if the component unmounts quickly after success
          // The success toast is better handled directly in handleSubmit for immediate feedback
        }
      }
    }
  }, [isLoading, error]);

  const handleDelete = async (e: React.MouseEvent) => {
    // Stop the event from bubbling up to parent elements if necessary
    e.stopPropagation();
    e.preventDefault();

    const success = await deleteTag(drawingId, name);
    if (success) {
      // If the API call was successful, call the parent's onDelete function
      onDelete(name);
      // Update the loading toast to success, or create a new one if it didn't exist
      if (toastId.current) {
        toast.update(toastId.current, {
          render: "Tag deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      } else {
        toast.success("Tag deleted successfully!"); // Fallback if no loading toast was initiated
      }
      toastId.current = null; // Reset the ref
    } else {
      if (!toastId.current && error) {
        // If for some reason the error happened without a loading toast
        toast.error(`Failed to delet tag: ${error.message || "Unknown error"}`);
      }
    }
    // You could add error handling here if needed, but the hook already stores the error state
  };

  return (
    // Use `group` to allow child elements to react to the parent's hover state
    <span className="group relative inline-flex items-center px-2.5 py-1 text-xs text-white font-medium rounded-full bg-tenaris-purple hover:bg-tenaris-purple-hover transition-colors duration-200 whitespace-nowrap">
      {name}

      {/* The Delete Button */}
      <button
        // Use `group-hover` to make the button visible when the parent span is hovered
        className="ml-2 -mr-1 p-0.5 rounded-full text-tenaris-purple bg-white opacity-75 hover:opacity-100 group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}
        disabled={isLoading}
        aria-label={`Remove tag ${name}`}
      >
        {/* Simple 'x' icon using SVG for crispness */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </span>
  );
}
