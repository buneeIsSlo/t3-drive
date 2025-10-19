"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SearchCommand } from "~/components/search-command";

interface GlobalSearchContextType {
  openSearch: () => void;
  closeSearch: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
      
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => setIsOpen(false);

  return (
    <GlobalSearchContext.Provider value={{ openSearch, closeSearch }}>
      {children}
      <SearchCommand open={isOpen} onOpenChange={setIsOpen} />
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error("useGlobalSearch must be used within a GlobalSearchProvider");
  }
  return context;
}
