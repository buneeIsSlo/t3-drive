import type { filesTable, foldersTable } from "~/server/db/schema";
import type { ViewMode } from "./drive-content";
import { FolderIcon, FileIcon as FileGlyph } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";

export type FileItem = typeof filesTable.$inferSelect;
export type FolderItem = typeof foldersTable.$inferSelect;

export function FileRow({
  file,
  viewMode,
}: {
  file: FileItem;
  viewMode: ViewMode;
}) {
  return (
    <li>
      <Link
        href={`/my-drive/files/${file.id}`}
        className={cn(
          "block cursor-pointer rounded-lg transition-colors",
          viewMode === "grid"
            ? "hover:bg-card block p-4 text-center"
            : "hover:bg-card flex items-center gap-3 p-2",
        )}
      >
        <FileGlyph
          className={cn(viewMode === "grid" ? "mx-auto h-12 w-12" : "h-5 w-5")}
        />
        <div className={cn(viewMode === "grid" ? "mt-2" : "flex-1")}>
          <p className="text-foreground truncate text-sm font-medium">
            {file.name}
          </p>
          {viewMode === "list" && (
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              {file.size && <span>{file.size}</span>}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

export function FolderRow({
  folder,
  viewMode,
}: {
  folder: FolderItem;
  viewMode: ViewMode;
}) {
  return (
    <li>
      <Link
        href={`/my-drive/folders/${folder.id}`}
        className={cn(
          "cursor-pointer rounded-lg transition-colors",
          viewMode === "grid"
            ? "hover:bg-card block p-4 text-center"
            : "hover:bg-card flex items-center gap-3 p-2",
        )}
      >
        <FolderIcon
          className={cn(viewMode === "grid" ? "mx-auto h-12 w-12" : "h-5 w-5")}
        />
        <div className={cn(viewMode === "grid" ? "mt-2" : "flex-1")}>
          <p className="text-foreground truncate text-sm font-medium">
            {folder.name}
          </p>
        </div>
      </Link>
    </li>
  );
}
