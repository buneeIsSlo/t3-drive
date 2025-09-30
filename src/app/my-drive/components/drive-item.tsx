import type { filesTable, foldersTable } from "~/server/db/schema";
import type { ViewMode } from "./drive-content";
import { FolderIcon } from "lucide-react";
import Link from "next/link";
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

  if (!isGrid) {
    return (
      <tr className="group odd:bg-muted/20 relative w-full border-b transition-colors last:border-b-0">
        <td className="flex-1 px-3 py-3 align-middle">
          <div className="flex items-center gap-3">
            <FileTypeIcon
              key={file.id}
              extension={extension}
              className="text-muted-foreground h-5 w-5"
            />
            <p className="text-foreground flex max-w-full text-sm font-medium">
              <span className="block min-w-0 self-center truncate">
                {baseName}
              </span>
              {extension && <span className="shrink-0">{extension}</span>}
            </p>
          </div>
        </td>
        <td className="text-muted-foreground px-3 py-3 align-middle text-sm">
          {file.createdAt.toLocaleDateString()}
        </td>
        <td className="text-muted-foreground px-3 py-3 align-middle text-sm">
          {file.size ? bytesToSize(file.size) : "--"}
        </td>
        <Link
          href={`/my-drive/files/${file.id}`}
          className="group-hover:bg-accent/40 absolute inset-0 rounded-md transition-colors"
          title={file.name}
        >
          <span className="sr-only">{file.name}</span>
        </Link>
      </tr>
    );
  }

  return (
    <li>
      <Link
        href={`/my-drive/files/${file.id}`}
        className="hover:bg-card block cursor-pointer rounded-lg p-4 text-center transition-colors"
        title={file.name}
      >
        <FileTypeIcon
          key={file.id}
          extension={extension}
          className="mx-auto h-12 w-12"
        />
        <div className="mt-2">
          <p className="text-foreground flex max-w-full justify-center text-sm font-medium">
            <span className="block min-w-0 self-center truncate">
              {baseName}
            </span>
            {extension && <span className="shrink-0">{extension}</span>}
          </p>
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

  if (!isGrid) {
    return (
      <tr className="group odd:bg-muted/20 relative w-full border-b transition-colors last:border-b-0">
        <td className="flex-1 px-3 py-3 align-middle">
          <div className="flex items-center gap-3">
            <FolderIcon className="text-muted-foreground h-5 w-5" />
            <p className="text-foreground truncate text-sm font-medium">
              {folder.name}
            </p>
          </div>
        </td>
        <td className="text-muted-foreground px-3 py-3 align-middle text-sm">
          {folder.createdAt.toLocaleDateString()}
        </td>
        <td className="text-muted-foreground px-3 py-3 align-middle text-sm">
          --
        </td>
        <Link
          href={`/my-drive/folders/${folder.id}`}
          className="group-hover:bg-accent/40 absolute inset-0 rounded-md transition-colors"
        >
          <span className="sr-only">{folder.name}</span>
        </Link>
      </tr>
    );
  }

  return (
    <li>
      <Link
        href={`/my-drive/folders/${folder.id}`}
        className="hover:bg-card block cursor-pointer rounded-lg p-4 text-center transition-colors"
      >
        <FolderIcon className="mx-auto h-12 w-12" />
        <div className="mt-2">
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
