"use client";

import type React from "react";

import { useState } from "react";
import {
  ChevronRight,
  LayoutGrid,
  List,
  MoreVertical,
  Upload,
  FolderPlus,
  ArrowLeft,
  HardDrive,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import type { FileItem, FolderItem } from "types/drive";
import { FileIcon } from "~/components/file-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface DriveContentProps {
  items: (FileItem | FolderItem)[];
  currentPath: string[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
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
              <Button variant="ghost" size="icon" onClick={onNavigateBack}>
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

        {!dragOver && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                : "space-y-2"
            }
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={`group ${
                  viewMode === "grid"
                    ? "hover:bg-card cursor-pointer rounded-lg p-4 transition-colors"
                    : "hover:bg-card flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                }`}
                onClick={() => {
                  if (item.type === "folder") {
                    onFolderClick(item);
                  } else {
                    window.open(item.url, "_blank");
                  }
                }}
              >
                <div
                  className={
                    viewMode === "grid"
                      ? "text-center"
                      : "flex flex-1 items-center gap-3"
                  }
                >
                  <FileIcon
                    type={item.type}
                    name={item.name}
                    size={viewMode === "grid" ? 48 : 24}
                  />
                  <div className={viewMode === "grid" ? "mt-2" : "flex-1"}>
                    <p className="text-foreground truncate text-sm font-medium">
                      {item.name}
                    </p>
                    {viewMode === "list" && (
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <span>{item.modifiedDate}</span>
                        {item.size && <span>{item.size}</span>}
                      </div>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Move to trash</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}

        {items.length === 0 && !dragOver && (
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
