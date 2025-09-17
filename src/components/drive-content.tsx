"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
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
  files: FileItem[];
  folders: FolderItem[];
  parents: FolderItem[]; // ordered from root to current
}

export function DriveContent({ files, folders, parents }: DriveContentProps) {
  const [dragOver, setDragOver] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const breadcrumbs = parents;

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
            <div className="flex items-center gap-2">
              {breadcrumbs.length > 0 && (
                <Link
                  href={
                    breadcrumbs.length > 1
                      ? `/my-drive/folders/${breadcrumbs[breadcrumbs.length - 2]!.id}`
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
                  {breadcrumbs.length > 0 && (
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                  )}
                </div>
                {breadcrumbs.map((segment, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Link
                      href={`/my-drive/folders/${segment.id}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {segment.name}
                    </Link>
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className="text-muted-foreground h-4 w-4" />
                    )}
                  </div>
                ))}
              </nav>
            </div>
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
                <FolderRow key={folder.id} folder={folder} viewMode="list" />
              ))}
              {files.map((file) => (
                <FileRow key={file.id} file={file} viewMode="list" />
              ))}
            </ul>
          ))}

        {folders.length === 0 && files.length === 0 && !dragOver && (
          <div className="flex h-full items-center justify-center">
            <div>{JSON.stringify(folders)}</div>
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
