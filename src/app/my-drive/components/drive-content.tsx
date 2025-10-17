"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  LayoutGrid,
  List,
  Upload,
  ArrowLeft,
  HardDrive,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  FileRow,
  FolderRow,
  type FileItem,
  type FolderItem,
} from "~/app/my-drive/components/drive-item";
import UploadFilesButton from "./upload-files-button";
import CreateNewFolderButton from "./create-new-folder-button";
import { useSearch } from "~/context/search-context";

export type ViewMode = "grid" | "list";

interface DriveContentProps {
  files: FileItem[];
  folders: FolderItem[];
  parents: FolderItem[]; // ordered from root to current
  initialViewMode?: ViewMode;
  folderId: number | null;
}

export function DriveContent({
  files: initialFiles,
  folders: initialFolders,
  parents,
  initialViewMode,
  folderId = null,
}: DriveContentProps) {
  const [dragOver, setDragOver] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode ?? "grid");
  const { searchResults } = useSearch();

  const isSearching = searchResults !== null;
  const displayFiles = searchResults ? searchResults.files : initialFiles;
  const displayFolders = searchResults ? searchResults.folders : initialFolders;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file upload logic here
    console.log("Files dropped:", e.dataTransfer.files);
  };

  return (
    <main className="flex flex-1 flex-col">
      {/* Toolbar */}
      <div className="border-border bg-background border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isSearching && (
              <div className="flex items-center gap-2">
                {parents.length > 0 && (
                  <Link
                    href={
                      parents.length > 1
                        ? `/my-drive/folders/${parents[parents.length - 2]!.id}`
                        : `/my-drive`
                    }
                  >
                    <Button variant="outline" size="icon">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <nav className="flex items-center gap-1 text-sm">
                  <div className="flex items-center gap-1">
                    <Link
                      href="/my-drive"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      My Drive
                    </Link>
                    {parents.length > 0 && (
                      <ChevronRight className="text-muted-foreground h-4 w-4" />
                    )}
                  </div>
                  {parents.map((segment, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Link
                        href={`/my-drive/folders/${segment.id}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {segment.name}
                      </Link>
                      {index < parents.length - 1 && (
                        <ChevronRight className="text-muted-foreground h-4 w-4" />
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            )}
            {isSearching && (
              <h2 className="text-lg font-semibold">Search Results</h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => {
                setViewMode("grid");
                try {
                  document.cookie = `viewMode=grid; path=/; max-age=31536000`;
                } catch {}
              }}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => {
                setViewMode("list");
                try {
                  document.cookie = `viewMode=list; path=/; max-age=31536000`;
                } catch {}
              }}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isSearching && (
          <div className="flex items-center gap-2">
            <UploadFilesButton folderId={folderId} />
            <CreateNewFolderButton parentFolderId={folderId} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        className={`flex-1 overflow-auto p-6 ${dragOver ? "bg-muted/50 border-primary border-2 border-dashed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && !isSearching && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Upload className="text-primary mx-auto mb-4 h-12 w-12" />
              <p className="text-primary text-lg font-medium">
                Drop files here to upload
              </p>
            </div>
          </div>
        )}

        {!dragOver &&
          (viewMode === "grid" ? (
            // Grid view
            <div className="space-y-8">
              {displayFolders.length > 0 && (
                <section>
                  <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                    Folders
                  </h3>
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {displayFolders.map((folder) => (
                      <FolderRow
                        key={folder.id}
                        folder={folder}
                        viewMode="grid"
                      />
                    ))}
                  </ul>
                </section>
              )}

              {displayFiles.length > 0 && (
                <section>
                  <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                    Files
                  </h3>
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {displayFiles.map((file) => (
                      <FileRow key={file.id} file={file} viewMode="grid" />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            // List view
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <colgroup>
                  <col className="w-[60%]" />
                  <col className="w-[24%]" />
                  <col className="w-[16%]" />
                  <col className="w-[1%]" />
                </colgroup>
                <thead className="bg-background/80 supports-[backdrop-filter]:bg-background/60">
                  <tr>
                    <th
                      scope="col"
                      className="text-muted-foreground px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="text-muted-foreground px-3 py-3 text-right text-xs font-semibold tracking-wider uppercase"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {displayFolders.map((folder) => (
                    <FolderRow
                      key={folder.id}
                      folder={folder}
                      viewMode="list"
                    />
                  ))}
                  {displayFiles.map((file) => (
                    <FileRow key={file.id} file={file} viewMode="list" />
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {displayFolders.length === 0 && displayFiles.length === 0 && !dragOver && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                <HardDrive className="text-muted-foreground h-12 w-12" />
              </div>
              <p className="text-foreground mb-2 text-lg font-medium">
                {isSearching ? "No results" : "This folder is empty"}
              </p>
              {!isSearching && (
                <p className="text-muted-foreground">
                  Drop files here or use the upload button to add content
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
