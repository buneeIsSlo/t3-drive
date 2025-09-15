"use client";

import type React from "react";

import { useState } from "react";
import {
  ChevronRight,
  LayoutGrid,
  List,
  Upload,
  FolderPlus,
  ArrowLeft,
  HardDrive,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import type { FileItem, FolderItem } from "types/drive";
import { FileRow, FolderRow } from "~/components/drive-item";

export type ViewMode = "grid" | "list";

interface DriveContentProps {
  items: {
    folders: FolderItem[];
    files: FileItem[];
  };
  currentPath: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onFolderClick: (folder: FolderItem) => void;
  onNavigateBack: () => void;
  onBreadcrumbClick: (index: number) => void;
}

export function DriveContent({
  items,
  currentPath,
  viewMode,
  onViewModeChange,
  onFolderClick,
  onNavigateBack,
  onBreadcrumbClick,
}: DriveContentProps) {
  const { folders, files } = items;
  const [dragOver, setDragOver] = useState(false);

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
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="border-border bg-background border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentPath.length > 1 && (
              <Button variant="outline" size="icon" onClick={onNavigateBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <nav className="flex items-center gap-1 text-sm">
              {currentPath.map((segment, index) => (
                <div key={index} className="flex items-center gap-1">
                  <button
                    onClick={() => onBreadcrumbClick(index)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {segment}
                  </button>
                  {index < currentPath.length - 1 && (
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => onViewModeChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            New folder
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`flex-1 overflow-auto p-6 ${dragOver ? "bg-muted/50 border-primary border-2 border-dashed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && (
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
              {folders.length > 0 && (
                <section>
                  <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                    Folders
                  </h3>
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {folders.map((folder) => (
                      <FolderRow
                        key={folder.id}
                        folder={folder}
                        viewMode="grid"
                        handleFolderClick={() => onFolderClick(folder)}
                      />
                    ))}
                  </ul>
                </section>
              )}

              {files.length > 0 && (
                <section>
                  <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                    Files
                  </h3>
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {files.map((file) => (
                      <FileRow key={file.id} file={file} viewMode="grid" />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            // List view
            <ul className="space-y-2">
              {folders.map((folder) => (
                <FolderRow
                  key={folder.id}
                  folder={folder}
                  viewMode="list"
                  handleFolderClick={() => onFolderClick(folder)}
                />
              ))}
              {files.map((file) => (
                <FileRow key={file.id} file={file} viewMode="list" />
              ))}
            </ul>
          ))}

        {items.folders.length === 0 &&
          items.files.length === 0 &&
          !dragOver && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                  <HardDrive className="text-muted-foreground h-12 w-12" />
                </div>
                <p className="text-foreground mb-2 text-lg font-medium">
                  This folder is empty
                </p>
                <p className="text-muted-foreground">
                  Drop files here or use the upload button to add content
                </p>
              </div>
            </div>
          )}
      </div>
    </main>
  );
}
