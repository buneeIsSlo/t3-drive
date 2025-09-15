import type { FileItem, FolderItem } from "types/drive";
import type { ViewMode } from "./drive-content";
import { FolderIcon, FileIcon as FileGlyph } from "lucide-react";

export function FileRow({
  file,
  viewMode,
}: {
  file: FileItem;
  viewMode: ViewMode;
}) {
  return (
    <li>
      <a
        href={file.url}
        target="_blank"
        rel="noreferrer"
        className={
          viewMode === "grid"
            ? "hover:bg-card block cursor-pointer rounded-lg p-4 text-center transition-colors"
            : "hover:bg-card flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
        }
      >
        <FileGlyph
          className={viewMode === "grid" ? "mx-auto h-12 w-12" : "h-5 w-5"}
        />
        <div className={viewMode === "grid" ? "mt-2" : "flex-1"}>
          <p className="text-foreground truncate text-sm font-medium">
            {file.name}
          </p>
          {viewMode === "list" && (
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              {file.size && <span>{file.size}</span>}
            </div>
          )}
        </div>
      </a>
    </li>
  );
}

export function FolderRow({
  folder,
  handleFolderClick,
  viewMode,
}: {
  folder: FolderItem;
  handleFolderClick: () => void;
  viewMode: ViewMode;
}) {
  return (
    <li>
      <div
        className={
          viewMode === "grid"
            ? "hover:bg-card cursor-pointer rounded-lg p-4 text-center transition-colors"
            : "hover:bg-card flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
        }
        onClick={handleFolderClick}
      >
        <FolderIcon
          className={viewMode === "grid" ? "mx-auto h-12 w-12" : "h-5 w-5"}
        />
        <div className={viewMode === "grid" ? "mt-2" : "flex-1"}>
          <p className="text-foreground truncate text-sm font-medium">
            {folder.name}
          </p>
        </div>
      </div>
    </li>
  );
}
