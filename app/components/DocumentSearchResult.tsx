import React from 'react';
import Image from 'next/image';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { PdfTable } from './PdfTable';
import { Document } from '@/lib/types';

// A new component to handle different states
type SearchStateProps = {
  iconSrc: string;
  altText: string;
  message: string;
  isLottie?: boolean;
};

const SearchState: React.FC<SearchStateProps> = ({
  iconSrc,
  altText,
  message,
  isLottie = false,
}) => (
  <div className="flex flex-col items-center justify-center mt-8">
    {isLottie ? (
      <DotLottieReact
        src={iconSrc}
        loop
        autoplay
        className="w-[200px] h-[200px]"
      />
    ) : (
      <Image
        src={iconSrc}
        alt={altText}
        width={200}
        height={200}
        style={{ objectFit: 'contain' }}
        priority
        className="w-[200px] h-[200px]"
      />
    )}
    <p className="text-center text-gray-500 mt-4">{message}</p>
  </div>
);


type DocumentSearchProps = {
  loading: boolean;
  error?: string | null; // Allow null
  documents: Document[];
  searchQuery: string;
};

const DocumentSearchResult: React.FC<DocumentSearchProps> = ({ loading, error, documents, searchQuery }) => {
  // 1. Show loader when a search is in progress
  // THIS IS THE MODIFIED PART
  if (loading) {
    return (
      <SearchState
        isLottie={true}
        iconSrc="/search-loader.json"
        altText="Loading results"
        message="Finding document..." // Your new message!
      />
    );
  }

  // 2. Show error message if an error occurs
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // 3. Show placeholder when there is no search query
  if (searchQuery.trim() === '') {
    return (
      <SearchState
        iconSrc="/placeholder.webp"
        altText="Placeholder"
        message="Find Document using Name or Tag..."
      />
    );
  }

  // 4. Show "Not Found" message
  if (documents.length === 0) {
    return (
      <SearchState
        iconSrc="/nobg.png"
        altText="Search Not Found"
        message="Document not Found! 😥"
      />
    );
  }

  // 5. Show the results table
  return <PdfTable documents={documents} />;
};

export default DocumentSearchResult;