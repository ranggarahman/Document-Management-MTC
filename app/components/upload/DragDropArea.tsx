import { MAX_FILE_SIZE } from "@/lib/utils";
import type { RefObject } from "react";
import { UploadCloud } from "lucide-react";

interface DragDropAreaProps {
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  validateAndSetFile: (selectedFile: File) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

const DragDropArea = ({
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  isDragging,
  validateAndSetFile,
  fileInputRef
}: DragDropAreaProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Document File
      </label>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex justify-center w-full h-full px-6 pt-5 pb-6 mt-1 border-2 border-dashed rounded-md cursor-pointer transition-colors duration-200 ${
          isDragging
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <div className="space-y-1 text-center">
          <UploadCloud className="w-12 h-12 mx-auto text-gray-400" />
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-indigo-600">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Any Kind of File up to {MAX_FILE_SIZE}MB. Just Kidding. Any size until server .142 storage runs out. 🤣
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) =>
              e.target.files && validateAndSetFile(e.target.files[0])
            }
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default DragDropArea;
