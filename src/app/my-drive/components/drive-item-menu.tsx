"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { MoreVertical, Star, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { deleteFile } from "../actions";

interface DriveItemMenuProps {
  fileId?: number;
}

export function DriveItemMenu({ fileId }: DriveItemMenuProps) {
  return (
    <DropdownMenu>
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
          variant="destructive"
          onClick={() => {
            if (!fileId) return;
            toast.promise(deleteFile(fileId), {
              loading: "Deleting file...",
              success: "File deleted",
              error: (err: unknown) => {
                const message = err instanceof Error ? err.message : undefined;
                return message ?? "Failed to delete file";
              },
            });
          }}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
