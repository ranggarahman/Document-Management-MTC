import { useState } from "react";
import { TicketPlus, X } from "lucide-react"; // Using a more descriptive icon
import { AddTagForm } from "./AddTagForm";

interface AddTagModalProps {
  drawingId: number; // or number, depending on your data model
  onTagAdded: (tag: string) => void;
}

const AddTagModal = ({ drawingId, onTagAdded }: AddTagModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleTagAdded = (tag: string) => {
    onTagAdded(tag);
    handleCloseModal();
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="group flex items-center justify-center overflow-hidden rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md transition-all duration-500 ease-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {/* The Icon that is always visible */}
        <TicketPlus className="h-6 w-6" />
        <p className="ml-2 whitespace-nowrap">Add Tag</p>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto p-4 justify-center bg-grey bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add a New Tag</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-500 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                <X className="h-6 w-6"/>
              </button>
            </div>
            <AddTagForm drawingId={drawingId} onTagAdded={handleTagAdded} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddTagModal;
