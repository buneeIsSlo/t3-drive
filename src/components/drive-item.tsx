import type { filesTable, foldersTable } from "~/server/db/schema";
import type { ViewMode } from "./drive-content";
import { FolderIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { FileTypeIcon } from "./file-icon";

export type FileItem = typeof filesTable.$inferSelect;
export type FolderItem = typeof foldersTable.$inferSelect;

export function FileRow({
  file,
  viewMode,
}: {
  file: FileItem;
  viewMode: ViewMode;
}) {
  const { baseName, extension } = splitFileName(file.name);
  const isGrid = viewMode === "grid";

  return (
    <li>
      <Link
        href={`/my-drive/files/${file.id}`}
        className={cn(
          "hover:bg-card block cursor-pointer rounded-lg transition-colors",
          isGrid ? "p-4 text-center" : "flex items-center gap-3 p-2",
        )}
        title={file.name}
      >
        <FileTypeIcon
          key={file.id}
          extension={extension}
          className={cn(isGrid ? "mx-auto h-12 w-12" : "h-5 w-5")}
        />
        <div className={cn(isGrid ? "mt-2" : "flex-1")}>
          <p
            className={cn(
              "text-foreground flex max-w-full text-sm font-medium",
              isGrid ? "justify-center" : "justify-start",
            )}
          >
            <span className="block min-w-0 self-center truncate">
              {baseName}
            </span>
            {extension && <span className="shrink-0">{extension}</span>}
          </p>
          {!isGrid && file.size && (
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <span>{bytesToSize(file.size)}</span>
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
  const isGrid = viewMode === "grid";

  return (
    <li>
      <Link
        href={`/my-drive/folders/${folder.id}`}
        className={cn(
          "hover:bg-card cursor-pointer rounded-lg transition-colors",
          isGrid ? "block p-4 text-center" : "flex items-center gap-3 p-2",
        )}
      >
        <FolderIcon className={cn(isGrid ? "mx-auto h-12 w-12" : "h-5 w-5")} />
        <div className={cn(isGrid ? "mt-2" : "flex-1")}>
          <p className="text-foreground truncate text-sm font-medium">
            {folder.name}
          </p>
        </div>
      </Link>
    </li>
  );
}

function splitFileName(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1;

  return {
    baseName: hasExtension ? fileName.slice(0, lastDotIndex) : fileName,
    extension: hasExtension ? fileName.slice(lastDotIndex) : "",
  };
}

function bytesToSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}
