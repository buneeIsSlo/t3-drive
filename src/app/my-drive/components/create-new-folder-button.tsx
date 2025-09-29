"use client";

import { useId, useState, useTransition } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useRouter } from "next/navigation";
import { createNewFolder } from "~/app/my-drive/actions";
import { toast } from "sonner";

export default function CreateNewFolderButton({
  parentFolderId,
}: {
  parentFolderId: number | null;
}) {
  const id = useId();
  const [folderName, setFolderName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const navigate = useRouter();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const sanitized = folderName.trim();
    if (!sanitized) {
      toast.error("Please enter a folder name.");
      return;
    }
    startTransition(async () => {
      const result = await createNewFolder(sanitized, parentFolderId);
      if (result.success) {
        toast.success(`Folder '${sanitized}' was created successfully.`);
        setFolderName("");
        setOpen(false);
        navigate.refresh();
      } else {
        toast.error(result.error ?? "Unknown error");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderPlus className="mr-2 h-4 w-4" />
          New folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FolderPlus className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Create new folder
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Choose a name for your new folder.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>Folder name</Label>
            <Input
              id={id}
              type="text"
              placeholder="e.g. Invoices"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
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
              disabled={folderName.trim() === "" || isPending}
            >
              {isPending ? "Creating..." : "Create folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
