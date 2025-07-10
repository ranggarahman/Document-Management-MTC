import { useState, useRef, useCallback, DragEvent, FC } from "react";
import { X, File as FileIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Document } from "@/lib/types";
import { useUploadDocument } from "../../hooks/useUploadDocument";
import FormBody from "./DocumentUploadModalFormBody";
import { MAX_FILE_SIZE, FORM_ID } from "@/lib/utils";
import DragDropArea from "./DragDropArea";
import { UploadModalFooter } from "./UploadModalFooter";
import { useAddTag } from "@/app/hooks/useAddTags";

// Define the props the component will accept
interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDocument: Document) => void; // Callback to refresh data in the parent
}

export const UploadDocumentModal: FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [createdBy, setCreatedBy] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [drawingName, setDrawingName] = useState("");
  const [description, setDescription] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [contractors, setContractors] = useState("");
  // --- NEW: State for Tags ---
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  // ... inside YourModalComponent

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormInvalid =
    !file ||
    !createdBy ||
    !drawingName ||
    !description

  const handleClose = () => {
    // Reset component-specific state
    setFile(null);
    setCreatedBy("");
    setValidationError(null);
    onClose();
  };

  // The hook handles API loading, API error, and the success callback logic
  const {
    uploadDocument,
    isLoading: isUploadingDoc, // Rename to avoid conflict
    error: docApiError,
  } = useUploadDocument((newDocument) => {
    onUploadSuccess(newDocument); // Propagate success to parent
    handleClose(); // Close the modal
  });

  // 2. Instantiate the TAG hook
  const {
    addTag,
    isLoading: isAddingTags, // Rename to avoid conflict
    error: tagApiError,
  } = useAddTag();

  // 3. Combine loading states for the submit button
  const isLoading = isUploadingDoc || isAddingTags;
  const apiError = docApiError || tagApiError || validationError;

  const validateAndSetFile = useCallback((selectedFile: File) => {
    setValidationError(null);
    // if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
    //   setValidationError(
    //     `Invalid file type. Please upload a PDF, JPG, PNG, GIF, or TIFF.`
    //   );
    //   setFile(null);
    //   return;
    // }
    if (selectedFile.size > MAX_FILE_SIZE * 1024 * 1024) {
      setValidationError(`File is too large. Max size is ${MAX_FILE_SIZE}MB.`);
      return;
    }
    setFile(selectedFile);
  }, []);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Necessary to allow drop
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
      // Clear the data transfer to avoid weird browser behaviors
      e.dataTransfer.clearData();
    }
  };

  // --- UPDATE THE SUBMIT HANDLER ---
  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // --- Validation Checks ---
    if (!file) {
      setValidationError("Please select a file to upload.");
      return;
    }
    // ... other validation checks

    setContractors(contractors.trim() === '' ? 'N/A' : contractors)


    setValidationError(null);

    // --- API CALLS ---

    // Create the data object for the main document
    const documentData = {
      drawingName,
      description,
      discipline,
      contractors,
      createdBy,
    };

    // STEP 1: Call the upload hook and AWAIT THE ID
    const newDocumentId = await uploadDocument(file, documentData);

    // STEP 2: If the upload was successful (ID is not null), upload the tags
    if (newDocumentId) {
      // If there are no tags, we are done! The onUploadSuccess will have already fired.
      if (tags.length === 0) {
        console.log("Document uploaded successfully without any tags.");
        toast.success("Document was uploaded with no tags.");
        return;
      }

      console.log(
        `Document created with ID: ${newDocumentId}. Now adding ${tags.length} tags.`
      );

      // Use Promise.all to add all tags concurrently
      const tagPromises = tags.map((tag) => addTag(newDocumentId, tag));
      const results = await Promise.all(tagPromises);

      if (results.includes(false)) {
        // You can optionally show a non-blocking warning that some tags failed
        toast.warn("Document was uploaded, but some tags could not be saved.");
      } else {
        console.log("All tags added successfully.");
      }

      // The onUploadSuccess callback (which closes the modal) has already been called
      // by the useUploadDocument hook, so we don't need to do anything else here.
    }
  };

  const handleTagInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    setTagInput(value);

    // If a comma is detected, create the tag
    if (value.endsWith(",")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      } else {
        toast.error("You have already included this tag.");
      }
      // Clear the input for the next tag
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // On backspace, if the input is empty, delete the last tag
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }

    // --- START: Added Logic ---
    // On Enter, create the tag
    if (e.key === "Enter") {
      // Prevent the default action (e.g., submitting a form)
      e.preventDefault();

      // Trim whitespace from the input to get the new tag
      const newTag = tagInput.trim();

      // Add the tag if it's not empty and not already in the list
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      } else {
        toast.error("You have already included this tag.");
      }

      // Clear the input for the next tag
      setTagInput("");
    }
  };

  interface RemoveTagFn {
    (tagToRemove: string): void;
  }

  const removeTag: RemoveTagFn = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center overflow-y-auto p-4 justify-center bg-grey bg-opacity-60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative flex w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Document 📝
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Form Body */}
          <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row md:space-x-6">
              {/* Column 1: FormBody */}
              <div className="w-full md:w-1/2">
                <FormBody
                  drawingName={drawingName}
                  setDrawingName={setDrawingName}
                  description={description}
                  setDescription={setDescription}
                  discipline={discipline}
                  setDiscipline={setDiscipline}
                  contractors={contractors}
                  setContractors={setContractors}
                  createdBy={createdBy}
                  setCreatedBy={setCreatedBy}
                />
              </div>

              {/* Column 2: DragDropArea */}
              <div className="w-full md:w-1/2 mt-6 md:mt-0">
                {/* --- NEW: TAGS INPUT FIELD --- */}
                <div className="mb-4">
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tags (separated by a comma)
                  </label>
                  <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                    <AnimatePresence>
                      {tags.map((tag) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-indigo-500 rounded-full hover:bg-indigo-200 hover:text-indigo-800"
                            aria-label={`Remove ${tag}`}
                          >
                            <X size={14} />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    <input
                      id="tags"
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      className="flex-1 min-w-[80px] p-2 focus:ring-0 text-sm text-gray-900 placeholder-gray-500"
                      placeholder={tags.length === 0 ? "Add tags..." : ""}
                    />
                  </div>
                </div>
                {/* --- END OF NEW TAGS INPUT FIELD --- */}
                <DragDropArea
                  handleDragEnter={handleDragEnter}
                  handleDragLeave={handleDragLeave}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  isDragging={isDragging}
                  validateAndSetFile={validateAndSetFile}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>
            {/* Selected File Display */}
            {file && (
              <div className="flex items-center justify-between p-3 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-md">
                <div className="flex items-center gap-3">
                  <FileIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium truncate">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 text-gray-500 rounded-full hover:bg-gray-300"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {/* Error Message Display */}
            {apiError && (
              <p className="text-sm text-center text-red-600">
                {apiError.toString()}
              </p>
            )}
            {/* Footer with Actions */}
            <UploadModalFooter
              formId={FORM_ID}
              onCancel={handleClose}
              isLoading={isLoading}
              isSubmitDisabled={isFormInvalid}
              submitText="Upload Document"
              loadingText="Uploading..."
            />
          </form>
        </div>
      </div>
    </div>
  );
};
