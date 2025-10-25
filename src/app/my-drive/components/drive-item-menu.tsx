"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import {
  FilePenLine,
  FolderPen,
  MoreVertical,
  Star,
  Trash,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { deleteFile, deleteFolder } from "../actions";
import RenameItemDialog from "./rename-item-dialog";

interface DriveItemMenuProps {
  fileId?: number;
  folderId?: number;
  name: string;
}

export function DriveItemMenu({ fileId, folderId, name }: DriveItemMenuProps) {
  const [isRenameDialogOpen, setRenameDialogOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    if (fileId) {
      toast.promise(deleteFile(fileId), {
        loading: "Deleting file...",
        success: "File deleted",
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : undefined;
          return message ?? "Failed to delete file";
        },
      });
    } else if (folderId) {
      toast.promise(deleteFolder(folderId), {
        loading: "Deleting folder...",
        success: "Folder deleted",
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : undefined;
          return message ?? "Failed to delete folder";
        },
      });
    }
  };

  return (
    <React.Fragment>
      <RenameItemDialog
        id={fileId ?? folderId!}
        type={fileId ? "file" : "folder"}
        name={name}
        open={isRenameDialogOpen}
        onOpenChange={setRenameDialogOpen}
      />
      <DropdownMenu open={isMenuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="pointer-events-auto">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Star className="mr-2 h-4 w-4" />
            Star
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setRenameDialogOpen(true);
              setMenuOpen(false);
            }}
          >
            {fileId ? (
              <FilePenLine className="mr-2 h-4 w-4" />
            ) : (
              <FolderPen className="mr-2 h-4 w-4" />
            )}
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </React.Fragment>
  );
}
