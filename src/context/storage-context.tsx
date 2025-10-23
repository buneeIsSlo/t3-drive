"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface StorageData {
  userStorageUsed: number;
}

interface StorageContextType {
  userStorageUsed: number;
  isLoading: boolean;
  refetchStorage: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [userStorageUsed, setUserStorageUsed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStorageData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/storage");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = (await response.json()) as StorageData;
      setUserStorageUsed(data.userStorageUsed);
    } catch (error) {
      console.error("Failed to fetch storage data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStorageData();
  }, [fetchStorageData]);

  const refetchStorage = () => {
    void fetchStorageData();
  };

  return (
    <StorageContext.Provider
      value={{ userStorageUsed, isLoading, refetchStorage }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}
