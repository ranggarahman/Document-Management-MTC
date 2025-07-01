import React from "react";
import { DISCIPLINES } from "@/lib/utils";
import CustomDropdown from "./DropDown";
// ### A. Define the props interface for the component
// This tells TypeScript exactly what data this component needs to receive.
interface FormBodyProps {
  drawingName: string;
  setDrawingName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  discipline: string;
  setDiscipline: (value: string) => void;
  contractors: string;
  setContractors: (value: string) => void;
  createdBy: string;
  setCreatedBy: (value: string) => void;
}

// ### B. Create the component function
// We destructure the props for easy access within the component.
const FormBody = ({
  drawingName,
  setDrawingName,
  description,
  setDescription,
  discipline,
  setDiscipline,
  contractors,
  setContractors,
  createdBy,
  setCreatedBy,
}: FormBodyProps) => {
  return (
    // Use a React Fragment <> to return multiple elements without a wrapping div
    <>
      {/* Drawing Name */}
      <div>
        <label
          htmlFor="drawingName"
          className="block text-sm font-medium text-gray-700"
        >
          Drawing Name / Title
        </label>
        <input
          id="drawingName"
          type="text"
          value={drawingName}
          onChange={(e) => setDrawingName(e.target.value)}
          placeholder="e.g., Main Floor Plan"
          className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of the document's contents."
          rows={3}
          className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Discipline and Contractors side-by-side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="w-full">
          <CustomDropdown
            label="Discipline"
            options={DISCIPLINES}
            value={discipline}
            onChange={setDiscipline}
            placeholder="..."
          />
        </div>
        <div>
          <label
            htmlFor="contractors"
            className="block text-sm font-medium text-gray-700"
          >
            Contractors
          </label>
          <input
            id="contractors"
            type="text"
            value={contractors}
            onChange={(e) => setContractors(e.target.value)}
            placeholder="e.g., PT. Konstruksi Jaya"
            className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Uploader Name Input */}
      <div>
        <label
          htmlFor="createdBy"
          className="block text-sm font-medium text-gray-700"
        >
          Uploader Name
        </label>
        <input
          id="createdBy"
          type="text"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          placeholder="e.g., John Doe"
          className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
    </>
  );
};

export default FormBody;
