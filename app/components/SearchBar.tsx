// src/components/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Document A..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full max-w-md text-blue-900 placeholder:text-gray-400 p-3 border rounded-lg shadow-sm bg-tenaris-gray-light border-tenaris-gray-medium hover:ring-2 hover:ring-tenaris-accent hover:outline-none transition-colors duration-200"
    />
  );
}
