"use client";

import { cn } from "@/lib/utils";
import { Loader2, Upload } from "lucide-react";
import { useId, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

type UploadDropzoneProps = {
  id?: string;
  accept?: string;
  metadata?: Record<string, unknown>;
  description?:
    | {
        fileTypes?: string;
        maxFileSize?: string;
        maxFiles?: number;
      }
    | string;
  onUploadComplete?: (urls: string[]) => void;
  route?: string;
};

export function UploadDropzone({
  id: _id,
  accept,
  metadata,
  description,
  onUploadComplete,
  route = "documents",
}: UploadDropzoneProps) {
  const id = useId();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64.split(",")[1]!);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      
      const base64 = await base64Promise;

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: base64,
          fileName: file.name,
          contentType: file.type,
          folder: route,
          metadata,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload");
      }

      const data = await response.json();
      return data.url;
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
      return null;
    }
  };

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop: async (files) => {
      if (files.length > 0 && !isUploading) {
        setIsUploading(true);
        const urls: string[] = [];
        for (const file of files) {
          const url = await uploadFile(file);
          if (url) urls.push(url);
        }
        setIsUploading(false);
        if (urls.length > 0 && onUploadComplete) {
          onUploadComplete(urls);
        }
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    noClick: true,
  });

  return (
    <div
      className={cn(
        "border-input text-foreground relative rounded-lg border border-dashed transition-colors",
        {
          "border-primary/80": isDragActive,
        }
      )}
    >
      <label
        {...getRootProps()}
        className={cn(
          "dark:bg-input/10 flex w-full min-w-72 cursor-pointer flex-col items-center justify-center rounded-lg bg-transparent px-2 py-6 transition-colors",
          {
            "text-muted-foreground cursor-not-allowed": isUploading,
            "hover:bg-accent dark:hover:bg-accent/40": !isUploading,
            "opacity-0": isDragActive,
          }
        )}
        htmlFor={_id || id}
      >
        <div className="my-2">
          {isUploading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <Upload className="size-6" />
          )}
        </div>

        <div className="mt-3 space-y-1 text-center">
          <p className="text-sm font-semibold">
            {isUploading ? "Uploading..." : "Drag and drop files here"}
          </p>

          <p className="text-muted-foreground max-w-64 text-xs">
            {typeof description === "string" ? (
              description
            ) : (
              <>
                {description?.maxFiles &&
                  `You can upload ${description.maxFiles} file${description.maxFiles !== 1 ? "s" : ""}.`}{" "}
                {description?.maxFileSize &&
                  `${description.maxFiles !== 1 ? "Each u" : "U"}p to ${description.maxFileSize}.`}{" "}
                {description?.fileTypes && `Accepted ${description.fileTypes}.`}
              </>
            )}
          </p>
        </div>

        <input
          {...getInputProps()}
          type="file"
          multiple
          id={_id || id}
          accept={accept}
          disabled={isUploading}
        />
      </label>

      {isDragActive && (
        <div className="pointer-events-none absolute inset-0 rounded-lg">
          <div className="dark:bg-accent/40 bg-accent flex size-full flex-col items-center justify-center rounded-lg">
            <div className="my-2">
              <Upload className="size-6" />
            </div>

            <p className="mt-3 text-sm font-semibold">Drop files here</p>
          </div>
        </div>
      )}
    </div>
  );
}
