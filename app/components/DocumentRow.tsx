// src/app/components/DocumentRow.tsx
"use client";

import React, { useState } from "react";
import { Document } from "@/lib/types";
import { useTags } from "../hooks/useTags";
import { Tag } from "./Tag";
import { getFileExtension } from "@/lib/types";
import AddTagModal from "./addTagModal";
import { Eye } from "lucide-react";

interface DocumentRowProps {
  doc: Document;
  onPreviewClick: (doc: Document) => void;
}

// const formatSize = (bytes: number) => {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
// };

export function DocumentRow({ doc, onPreviewClick }: DocumentRowProps) {
  const { tags, loading, error, removeLocalTag, addLocalTag } = useTags(doc.id);

  const [showAllTags, setShowAllTags] = useState(false);
  const tagLimit = 7;

  const tagsToDisplay = showAllTags ? tags : tags.slice(0, tagLimit);
  const hasMoreTags = tags.length > tagLimit;

  return (
    <tr className="border-b border-color-tenaris-gray-medium hover:bg-gray-50 transition-colors">
      {/* Change 1: Applied truncation classes.
        - `truncate` is a Tailwind utility that combines:
          - `overflow: hidden`
          - `text-overflow: ellipsis`
          - `white-space: nowrap`
        - Added `title` attribute for hover-to-see-full-name UX.
      */}
      {/* Apply padding ONLY to the cell */}
      <td className="px-6 py-4 max-w-sm">
        {/* This inner div creates the boundary needed for the ellipsis */}
        <div className="truncate" title={doc.title}>
          {doc.title}
        </div>
      </td>

      <td className="px-6 py-4 text-red-500">{getFileExtension(doc.path)}</td>
      <td className="px-6 py-4 text-tenaris-blue-dark">{doc.description}</td>

      {/* The fixed layout on the parent table prevents this column from collapsing.
        The `min-h-[value]` ensures the row height stays consistent even when empty.
      */}
      <td className="px-6 py-4 max-w-sm">
        <div className="flex flex-wrap items-center gap-2 min-h-[36px]">
          {" "}
          {/* Added min-h for consistent row height */}
          {loading && (
            <p className="text-xs italic text-gray-400">Loading tags...</p>
          )}
          {error && <p className="text-xs text-red-500">Error: {error}</p>}
          {/* Change 2: Added a check for when loading is done and there are no tags */}
          {!loading && !error && tags.length === 0 && (
            <p className="text-xs italic text-gray-400">No tags added</p>
          )}
          {tagsToDisplay.map((tagName) => (
            <Tag
              key={tagName}
              name={tagName}
              drawingId={doc.id}
              onDelete={removeLocalTag}
            />
          ))}
          {hasMoreTags && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-2 py-1 text-xs text-blue-600 font-medium rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {showAllTags ? `Show Less` : `+${tags.length - tagLimit} more`}
            </button>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col items-start gap-4">
          <AddTagModal drawingId={doc.id} onTagAdded={addLocalTag} />
          <button
            onClick={() => onPreviewClick(doc)}
            className="group flex items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-all duration-500 ease-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" // Added whitespace-nowrap
          >
            <Eye className="h-6 w-6" />
            <p className="ml-2 whitespace-nowrap">Preview</p>
          </button>
        </div>
      </td>
    </tr>
  );
}
