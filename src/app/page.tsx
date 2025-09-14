"use client";

import { useState } from "react";
import { DriveHeader } from "~/components/drive-header";
import { DriveSidebar } from "~/components/drive-sidebar";
import { DriveContent } from "~/components/drive-content";
import type { FileItem, FolderItem } from "types/drive";

// Mock data for the Google Drive clone
const mockData: (FileItem | FolderItem)[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    modifiedDate: "2024-01-15",
    size: null,
    children: [
      {
        id: "2",
        name: "Resume.pdf",
        type: "file",
        modifiedDate: "2024-01-10",
        size: "245 KB",
        url: "#",
      },
      {
        id: "3",
        name: "Cover Letter.docx",
        type: "file",
        modifiedDate: "2024-01-12",
        size: "89 KB",
        url: "#",
      },
      {
        id: "4",
        name: "Project Proposal.pdf",
        type: "file",
        modifiedDate: "2024-01-08",
        size: "1.2 MB",
        url: "#",
      },
    ],
  },
  {
    id: "5",
    name: "Images",
    type: "folder",
    modifiedDate: "2024-01-20",
    size: null,
    children: [
      {
        id: "6",
        name: "vacation-photo.jpg",
        type: "file",
        modifiedDate: "2024-01-18",
        size: "2.4 MB",
        url: "#",
      },
      {
        id: "7",
        name: "screenshot.png",
        type: "file",
        modifiedDate: "2024-01-19",
        size: "856 KB",
        url: "#",
      },
      {
        id: "8",
        name: "logo-design.svg",
        type: "file",
        modifiedDate: "2024-01-17",
        size: "124 KB",
        url: "#",
      },
    ],
  },
  {
    id: "9",
    name: "Spreadsheet.xlsx",
    type: "file",
    modifiedDate: "2024-01-22",
    size: "567 KB",
    url: "#",
  },
  {
    id: "10",
    name: "Presentation.pptx",
    type: "file",
    modifiedDate: "2024-01-21",
    size: "3.2 MB",
    url: "#",
  },
  {
    id: "11",
    name: "Projects",
    type: "folder",
    modifiedDate: "2024-01-25",
    size: null,
    children: [
      {
        id: "12",
        name: "Website Mockup.fig",
        type: "file",
        modifiedDate: "2024-01-24",
        size: "4.1 MB",
        url: "#",
      },
      {
        id: "13",
        name: "Database Schema.sql",
        type: "file",
        modifiedDate: "2024-01-23",
        size: "45 KB",
        url: "#",
      },
    ],
  },
];

export default function GoogleDriveClone() {
  const [currentPath, setCurrentPath] = useState<string[]>(["My Drive"]);
  const [currentItems, setCurrentItems] =
    useState<(FileItem | FolderItem)[]>(mockData);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const navigateToFolder = (folder: FolderItem) => {
    setCurrentPath([...currentPath, folder.name]);
    setCurrentItems(folder.children ?? []);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);

      if (newPath.length === 1) {
        setCurrentItems(mockData);
      } else {
        // Navigate to parent folder - simplified for demo
        setCurrentItems(mockData);
      }
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === 0) {
      setCurrentPath(["My Drive"]);
      setCurrentItems(mockData);
    } else {
      // Simplified navigation for demo
      setCurrentPath(currentPath.slice(0, index + 1));
      setCurrentItems(mockData);
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
