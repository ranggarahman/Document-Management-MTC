// src/app/components/DocumentRow.tsx
"use client";

import React, { useState } from "react";
import { Document } from "@/lib/types";
import { useTags } from "../hooks/useTags";
import { Tag } from "./Tag";
import { AddTagForm } from "./AddTagForm";
//import { extractPdfPath } from "@/lib/types";

interface DocumentRowProps {
  doc: Document;
  onPreviewClick: (doc: Document) => void;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

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
      <td
        className="px-6 py-4 text-tenaris-blue-dark font-medium truncate"
        title={doc.title}
      >
        {doc.title}
      </td>

      <td className="px-6 py-4 text-red-500">{formatSize(doc.size)}</td>

      {/* The fixed layout on the parent table prevents this column from collapsing.
        The `min-h-[value]` ensures the row height stays consistent even when empty.
      */}
      <td className="px-6 py-4">
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
        <div className="flex items-start gap-4">
          <AddTagForm drawingId={doc.id} onTagAdded={addLocalTag} />
          <button
            onClick={() => onPreviewClick(doc)}
            className="font-semibold text-tenaris-accent hover:underline whitespace-nowrap" // Added whitespace-nowrap
          >
            Preview
          </button>
        </div>
      </td>
    </tr>
  );
}
