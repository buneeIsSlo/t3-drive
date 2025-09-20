"use client";

import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useRef } from "react";
import { useUploadThing } from "./uploadthing";
import { toast } from "sonner";

export default function UploadFilesButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing(
    (routerRegistry) => routerRegistry.imageUploader,
    {
      uploadProgressGranularity: "fine",

      onUploadBegin: () => {
        toast.loading("Uploading files...", { id: "upload-toast" });
      },

      onUploadProgress: (p: number) => {
        toast.loading(`Uploading files... [${p}% ]`, {
          id: "upload-toast",
          className: "w-full",
        });
      },

      onClientUploadComplete: () => {
        toast.success("Upload complete", { id: "upload-toast" });
        if (fileInputRef.current) fileInputRef.current.value = "";
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
      await startUpload(files);
    },
    [startUpload],
  );

  return (
    <div className="relative inline-block">
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={() => fileInputRef.current?.click()}
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
        accept="image/*"
        multiple
        onChange={onFileChange}
      />
    </div>
  );
}
