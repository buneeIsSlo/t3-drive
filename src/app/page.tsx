"use client";

import { useState, useMemo } from "react";
import { DriveHeader } from "~/components/drive-header";
import { DriveSidebar } from "~/components/drive-sidebar";
import { DriveContent, type ViewMode } from "~/components/drive-content";
import type { FolderItem } from "types/drive";
import { mockFolders, mockFiles } from "~/lib/mock-data";

export default function T3Drive() {
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const currentItems = useMemo(
    () => ({
      folders: mockFolders.filter((folder) => folder.parent === currentFolder),
      files: mockFiles.filter((file) => file.parent === currentFolder),
    }),
    [currentFolder],
  );

  const breadcrumbs = useMemo(() => {
    const breadcrumbs = [];
    let currentId = currentFolder;

    while (currentId !== "root") {
      const folder = mockFolders.find((f) => f.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parent ?? "root";
      } else {
        break;
      }
    }

    return breadcrumbs;
  }, [currentFolder]);

  const currentPath = useMemo(() => {
    return ["My Drive", ...breadcrumbs.map((f) => f.name)];
  }, [breadcrumbs]);

  const navigateToFolder = (folder: FolderItem) => {
    setCurrentFolder(folder.id);
  };

  const navigateBack = () => {
    if (currentFolder !== "root") {
      const currentFolderData = mockFolders.find((f) => f.id === currentFolder);
      if (currentFolderData?.parent) {
        setCurrentFolder(currentFolderData.parent);
      } else {
        setCurrentFolder("root");
      }
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === 0) {
      setCurrentFolder("root");
    } else {
      const targetFolder = breadcrumbs[index - 1];
      if (targetFolder) {
        setCurrentFolder(targetFolder.id);
      }
    }
  };

  return (
    <div className="bg-background flex h-screen flex-col">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar />
        <DriveContent
          items={currentItems}
          currentPath={currentPath}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFolderClick={navigateToFolder}
          onNavigateBack={navigateBack}
          onBreadcrumbClick={navigateToBreadcrumb}
        />
      </div>
    </div>
  );
}
