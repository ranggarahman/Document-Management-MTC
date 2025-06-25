import { Loader2 } from "lucide-react"; // Assuming you use lucide-react for icons

// Define the types for the component's props
interface FormActionsProps {
  /**
   * Function to be executed when the cancel button is clicked.
   */
  onCancel: () => void;
  /**
   * A unique string that links the submit button to the form.
   */
  formId: string;
  /**
   * If true, the component will show a loading state.
   */
  isLoading: boolean;
  /**
   * If true, the submit button will be disabled. This is typically
   * tied to form validation state.
   */
  isSubmitDisabled: boolean;
  /**
   * Optional text for the submit button in its default state.
   * @default "Submit"
   */
  submitText?: string;
  /**
   * Optional text for the submit button in its loading state.
   * @default "Submitting..."
   */
  loadingText?: string;
}

/**
 * A reusable component for displaying cancel and submit actions,
 * typically at the bottom of a form or a modal.
 */
export function UploadModalFooter({
  onCancel,
  formId,
  isLoading,
  isSubmitDisabled,
  submitText = "Submit",
  loadingText = "Submitting...",
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        form={formId}
        // The button is disabled if the form is invalid OR if it's currently loading.
        disabled={isSubmitDisabled || isLoading}
        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
        {isLoading ? loadingText : submitText}
      </button>
    </div>
  );
}