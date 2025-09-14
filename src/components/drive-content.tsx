"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, Grid3X3, List, MoreVertical, Upload, FolderPlus, ArrowLeft, HardDrive } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { FileItem, FolderItem } from "~/types/drive"
import { FileIcon } from "~/components/file-icon"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

interface DriveContentProps {
  items: (FileItem | FolderItem)[]
  currentPath: string[]
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onFolderClick: (folder: FolderItem) => void
  onNavigateBack: () => void
  onBreadcrumbClick: (index: number) => void
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
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // Handle file upload logic here
    console.log("Files dropped:", e.dataTransfer.files)
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-border p-4 bg-background">
        <div className="flex items-center justify-between mb-4">
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
                  {index < currentPath.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
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
              <Grid3X3 className="h-4 w-4" />
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
        className={`flex-1 p-6 overflow-auto ${dragOver ? "bg-muted/50 border-2 border-dashed border-primary" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-lg font-medium text-primary">Drop files here to upload</p>
            </div>
          </div>
        )}

        {!dragOver && (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-2"
            }
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={`group ${
                  viewMode === "grid"
                    ? "p-4 rounded-lg hover:bg-card transition-colors cursor-pointer"
                    : "flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors cursor-pointer"
                }`}
                onClick={() => {
                  if (item.type === "folder") {
                    onFolderClick(item as FolderItem)
                  } else {
                    window.open(item.url, "_blank")
                  }
                }}
              >
                <div className={viewMode === "grid" ? "text-center" : "flex items-center gap-3 flex-1"}>
                  <FileIcon type={item.type} name={item.name} size={viewMode === "grid" ? 48 : 24} />
                  <div className={viewMode === "grid" ? "mt-2" : "flex-1"}>
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    {viewMode === "list" && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
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
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <HardDrive className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">This folder is empty</p>
              <p className="text-muted-foreground">Drop files here or use the upload button to add content</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
