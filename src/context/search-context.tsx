"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { searchAction } from "~/app/my-drive/actions";
import type { FileItem, FolderItem } from "~/app/my-drive/components/drive-item";

interface SearchContextType {
  isSearching: boolean;
  searchResults: { files: FileItem[]; folders: FolderItem[] } | null;
  noResults: boolean;
  performSearch: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isSearching, startSearchTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<{ files: FileItem[]; folders: FolderItem[] } | null>(null);
  const [noResults, setNoResults] = useState(false);

  const performSearch = (query: string) => {
    if (!query) {
      clearSearch();
      return;
    }
    startSearchTransition(async () => {
      const result = await searchAction(query);
      if (result.success) {
        const hasResults = result.data.files.length > 0 || result.data.folders.length > 0;
        setSearchResults(result.data);
        setNoResults(!hasResults);
      } else {
        // Handle search error, maybe with a toast notification
        console.error(result.error);
        setNoResults(true);
      }
    });
  };

  const clearSearch = () => {
    setSearchResults(null);
    setNoResults(false);
  };

  return (
    <SearchContext.Provider value={{ isSearching, searchResults, noResults, performSearch, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
