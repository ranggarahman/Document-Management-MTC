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
