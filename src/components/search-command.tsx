"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Folder, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { searchAction } from "~/app/my-drive/actions";
import type { FileItem, FolderItem } from "~/app/my-drive/components/drive-item";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ files: FileItem[]; folders: FolderItem[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      void (async () => {
        setIsSearching(true);
        try {
          const response = await searchAction(query);
          if (response.success && response.data) {
            setResults(response.data as { files: FileItem[]; folders: FolderItem[] });
          } else {
            setResults(null);
          }
        } catch (error) {
          console.error("Search error:", error);
          setResults(null);
        } finally {
          setIsSearching(false);
        }
      })();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (type: "file" | "folder", id: number) => {
    if (type === "file") {
      router.push(`/my-drive/files/${id}`);
    } else {
      router.push(`/my-drive/folders/${id}`);
    }
    onOpenChange(false);
    setQuery("");
    setResults(null);
  };

  const totalResults = results ? results.files.length + results.folders.length : 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Drive"
      description="Search for files and folders"
      className="md:min-w-xl"
    >
      <CommandInput
        placeholder="Search files and folders..."
        value={query}
        onValueChange={(val: string) => setQuery(val)}
      />
      <CommandList className="py-2">
        {!query.trim() && (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Start typing to search...</p>
            </div>
          </CommandEmpty>
        )}

        {query.trim() && isSearching && (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          </CommandEmpty>
        )}

        {query.trim() && !isSearching && totalResults === 0 && (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{`No results found for "${query}"`}</p>
            </div>
          </CommandEmpty>
        )}

        {results && results.folders.length > 0 && (
          <CommandGroup heading="Folders">
            {results.folders.map((folder) => (
              <CommandItem
                key={`folder-${folder.id}`}
                value={`folder-${folder.id}-${folder.name}`}
                onSelect={() => handleSelect("folder", folder.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Folder className="h-4 w-4 text-blue-500" />
                <span className="truncate">{folder.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results && results.files.length > 0 && (
          <CommandGroup heading="Files">
            {results.files.map((file) => (
              <CommandItem
                key={`file-${file.id}`}
                value={`file-${file.id}-${file.name}`}
                onSelect={() => handleSelect("file", file.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-green-500" />
                <span className="truncate">{file.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
