"use client";

import React, { createContext, useContext, useMemo, useState, useTransition, useEffect, useCallback } from "react";
import { searchAction } from "~/app/my-drive/actions";
import type { FileItem, FolderItem } from "~/app/my-drive/components/drive-item";
import { useDebounce } from "~/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchResults {
  files: FileItem[];
  folders: FolderItem[];
}

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  isSearching: boolean;
  results: SearchResults | null;
  hasResults: boolean;
  isSearchActive: boolean;
  clearSearch: () => void;
  clearSearchOnNavigate: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isSearching, startSearchTransition] = useTransition();

  const debouncedQuery = useDebounce(query, 800);

  const hasResults = !!results && (results.files.length > 0 || results.folders.length > 0);
  const isSearchActive = query !== "";

  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentQuery = searchParams.get("q") ?? "";
    
    if (currentPath !== "/my-drive" && !currentQuery) {
      setQuery("");
      setResults(null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults(null);
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl);
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("q", debouncedQuery);
    router.replace(`?${params.toString()}`);

    startSearchTransition(async () => {
      console.log("Performing search for:", debouncedQuery);
      const resp = await searchAction(debouncedQuery);
      if (resp.success && resp.data) {
        const hasResults = resp.data.files.length > 0 || resp.data.folders.length > 0;
        setResults(hasResults ? resp.data as SearchResults : null);
      } else {
        setResults(null);
        console.error(resp.error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults(null);
  }, []);

  const clearSearchOnNavigate = useCallback(() => {
    setQuery("");
    setResults(null);
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl);
  }, [router, searchParams]);

  const value = useMemo(
    () => ({ query, setQuery, isSearching, results, hasResults, isSearchActive, clearSearch, clearSearchOnNavigate }),
    [query, isSearching, results, hasResults, isSearchActive, clearSearch, clearSearchOnNavigate],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
}
