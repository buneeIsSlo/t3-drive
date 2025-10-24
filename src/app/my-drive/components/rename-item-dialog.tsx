"use client";

import { useId, useState, useTransition } from "react";
import { FilePenLine } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { renameItem } from "../actions";

interface RenameItemDialogProps {
  id: number;
  type: "file" | "folder";
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RenameItemDialog({
  id,
  type,
  name,
  open,
  onOpenChange,
}: RenameItemDialogProps) {
  const componentId = useId();
  const [itemName, setItemName] = useState(name);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const sanitized = itemName.trim();
    if (!sanitized) {
      toast.error("Please enter a name.");
      return;
    }
    startTransition(async () => {
      try {
        await renameItem({ id, type, name: sanitized });
        toast.success(`'${name}' was renamed to '${sanitized}' successfully.`);
        setItemName(sanitized);
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to rename",
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FilePenLine className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Rename {type}</DialogTitle>
            <DialogDescription className="sm:text-center">
              Choose a new name for your {type}.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="*:not-first:mt-2">
            <Label htmlFor={componentId}>New name</Label>
            <Input
              id={componentId}
              type="text"
              placeholder="e.g. Cool-Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="flex-1"
              disabled={itemName.trim() === "" || isPending}
            >
              {isPending ? "Renaming..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
