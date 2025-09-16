"use client";

import type React from "react";

import { useState, useMemo } from "react";
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
import {
  FileRow,
  FolderRow,
  type FileItem,
  type FolderItem,
} from "~/components/drive-item";

export type ViewMode = "grid" | "list";

interface DriveContentProps {
  initialFiles: FileItem[];
  initialFolders: FolderItem[];
}

export function DriveContent({
  initialFiles,
  initialFolders,
}: DriveContentProps) {
  const [currentFolder, setCurrentFolder] = useState<number>(0); // 0 is root
  const [dragOver, setDragOver] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Filter items based on current folder
  const currentItems = useMemo(() => {
    const folders = initialFolders.filter((f) => f.parent === currentFolder);
    const files = initialFiles.filter((f) => f.parent === currentFolder);
    return { folders, files };
  }, [currentFolder, initialFolders, initialFiles]);

  const { folders, files } = currentItems;

  // Build breadcrumbs
  const breadcrumbs = useMemo(() => {
    const breadcrumbs = [];
    let currentId = currentFolder;

    while (currentId !== 0) {
      const folder = initialFolders.find((f) => f.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parent ?? 0;
      } else {
        break;
      }
    }

    return breadcrumbs;
  }, [currentFolder, initialFolders]);

  const currentPath = useMemo(() => {
    return ["My Drive", ...breadcrumbs.map((f) => f.name)];
  }, [breadcrumbs]);

  const navigateToFolder = (folder: FolderItem) => {
    setCurrentFolder(folder.id);
  };

  const navigateBack = () => {
    if (currentFolder !== 0) {
      const currentFolderData = initialFolders.find(
        (f) => f.id === currentFolder,
      );
      if (currentFolderData && currentFolderData.parent !== null) {
        setCurrentFolder(currentFolderData.parent);
      } else {
        setCurrentFolder(0);
      }
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === 0) {
      setCurrentFolder(0);
    } else {
      const targetFolder = breadcrumbs[index - 1];
      if (targetFolder) {
        setCurrentFolder(targetFolder.id);
      }
    }
  };

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
              <Button variant="outline" size="icon" onClick={navigateBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <nav className="flex items-center gap-1 text-sm">
              {currentPath.map((segment, index) => (
                <div key={index} className="flex items-center gap-1">
                  <button
                    onClick={() => navigateToBreadcrumb(index)}
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
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
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
                        handleFolderClick={() => navigateToFolder(folder)}
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
                  handleFolderClick={() => navigateToFolder(folder)}
                />
              ))}
              {files.map((file) => (
                <FileRow key={file.id} file={file} viewMode="list" />
              ))}
            </ul>
          ))}

        {folders.length === 0 && files.length === 0 && !dragOver && (
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
