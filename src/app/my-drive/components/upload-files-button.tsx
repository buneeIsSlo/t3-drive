"use client";

import { Upload } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useCallback, useRef } from "react";
import { useUploadThing } from "../../../components/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TOTAL_STORAGE } from "./storage-indicator";
import { useStorage } from "~/context/storage-context";

interface UploadFilesButtonProps {
  folderId: number | null;
}

export default function UploadFilesButton({
  folderId,
}: UploadFilesButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useRouter();
  const { userStorageUsed, refetchStorage } = useStorage();

  const isStorageAvailable = userStorageUsed < TOTAL_STORAGE;

  const { startUpload, isUploading } = useUploadThing(
    (routerRegistry) => routerRegistry.imageUploader,
    {
      uploadProgressGranularity: "fine",

      onUploadBegin: () => {
        toast.loading("Uploading files...", {
          id: "upload-toast",
          description: "",
        });
      },

      onUploadProgress: (p: number) => {
        toast.loading(`Uploading files... (${p}%)`, {
          id: "upload-toast",
          className: "w-full",
          description: "",
        });
      },

      onClientUploadComplete: () => {
        toast.success("Upload complete", { id: "upload-toast" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        navigate.refresh();
        refetchStorage();
      },

      onUploadError: (e) => {
        toast.error("Upload failed", {
          id: "upload-toast",
          description: e instanceof Error ? e.message : "Unexpected error",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    },
  );

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length === 0) return;

      await startUpload(files, { folderId });
    },
    [startUpload, folderId],
  );

  return (
    <div className="relative inline-block">
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={() => {
          if (!isStorageAvailable) {
            toast.error("Upload Failed", {
              description:
                "You’ve reached your storage limit and cannot upload more files.",
            });
            return;
          }
          fileInputRef.current?.click();
        }}
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="sr-only"
        aria-label="Upload"
        accept="*/*"
        multiple
        onChange={onFileChange}
      />
    </div>
  );
}
