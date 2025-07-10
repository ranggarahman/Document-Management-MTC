// src/lib/types.ts
export interface Tag {
  id: number;
  name: string;
}

export interface Document {
  id: number;
  title: string;         // from new_doc_row.DrawingName
  path: string;          // from new_doc_row.DrawingPath
  size: number;          // from new_doc_row.Size
  created_at: string;    // from new_doc_row.CreatedDate
  CreatedBy?: string;     // from new_doc_row.CreatedBy (Note the uppercase 'C')
  description?: string;   // from new_doc_row.DrawingDescription
  discipline?: string;    // from new_doc_row.DrawingDiscipline
  contractors?: string;   // from new_doc_row.DrawingContractors
}

export function extractPdfPath(fullPath: string): string {
  // Replace any backslashes with forward slashes for URL compatibility
  const normalizedPath = fullPath.replace(/\\/g, '/');

  // Prepend the new public directory path
  return `/Drawing/${normalizedPath}`;
}

export function getFileExtension(path:string): string {
  // Find the index of the last dot
  const lastDotIndex = path.lastIndexOf('.');

  // If there's no dot, or it's the first character (e.g., ".bashrc"), return an empty string
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return '';
  }

  // Return the part of the string after the last dot
  return path.substring(lastDotIndex);
};
