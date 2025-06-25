import { useState, useRef, useCallback, DragEvent, FC } from "react";
import { X, File as FileIcon } from "lucide-react";
// import { toast } from "react-toastify";
import { Document } from "@/lib/types";
import { useUploadDocument } from "../../hooks/useUploadDocument";
import FormBody from "./DocumentUploadModalFormBody";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, FORM_ID } from "@/lib/utils";
import DragDropArea from "./DragDropArea";
import { UploadModalFooter } from "./UploadModalFooter";
import { DocumentFormData } from "../../hooks/useUploadDocument";

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    // Reset component-specific state
    setFile(null);
    setCreatedBy("");
    setValidationError(null);
    onClose();
  };

  // --- USE THE HOOK ---
  // The hook handles API loading, API error, and the success callback logic
  const {
    uploadDocument,
    isLoading,
    error: apiError,
  } = useUploadDocument((newDocument) => {
    onUploadSuccess(newDocument); // Propagate success to the parent page
    handleClose(); // Close the modal on success
  });

  const validateAndSetFile = useCallback((selectedFile: File) => {
    setValidationError(null);
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setValidationError(
        `Invalid file type. Please upload a PDF, JPG, PNG, GIF, or TIFF.`
      );
      setFile(null);
      return;
    }
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
  // It is now much cleaner and only handles form validation.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setValidationError("Please select a file to upload.");
      return;
    }
    if (!createdBy.trim()) {
      setValidationError("Please enter the name of the uploader.");
      return;
    }

    //DOCUMENT SUBMIT CALL

        // Create the data object that matches the DocumentFormData interface
    const formData: DocumentFormData = {
      drawingName,
      description,
      discipline,
      contractors,
      createdBy,
    };
    
    // Call the hook with both the file and the form data object
    await uploadDocument(file, formData);
  };

  if (!isOpen) return null;

  const isFormInvalid =
    !file ||
    !createdBy ||
    !drawingName ||
    !description ||
    !discipline ||
    !contractors.length;

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
            Add New Document
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
            {(validationError || apiError) && (
              <p className="text-sm text-center text-red-600">
                {validationError || apiError}
              </p>
            )}
            {/* Footer with Actions */}
            <UploadModalFooter
              formId={FORM_ID}
              onCancel={handleClose}
              isLoading={isLoading}
              isSubmitDisabled={isFormInvalid}
              submitText="Upload Drawing"
              loadingText="Uploading..."
            />
          </form>
        </div>
      </div>
    </div>
  );
};
