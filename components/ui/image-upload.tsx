"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  route?: string; // Kept for compatibility, can be used as folder
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  route = "images",
  multiple = false,
  maxFiles = 4,
  className,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  // Normalize value to array
  const images = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  }, [value]);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(",")[1];
          if (!base64Data) {
            reject(new Error("Failed to convert file to base64"));
          }
          resolve(base64Data!);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
      });
      reader.readAsDataURL(file);
      
      const base64 = await base64Promise;
      setUploadProgress(30);

      const uploadPayload = {
        file: base64,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        folder: route,
      };

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadPayload),
      });

      setUploadProgress(80);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      setUploadProgress(100);
      return data.url;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (disabled || isUploading) return;

    const fileArray = Array.from(files);
    const filesToUpload = multiple
      ? fileArray.slice(0, maxFiles - images.length)
      : [fileArray[0]!];

    const uploadedUrls: string[] = [];
    for (const file of filesToUpload) {
      if (!file) continue;
      const url = await uploadFile(file);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0] as string);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange("");
    }
  };

  const canAddMore = multiple ? images.length < maxFiles : images.length === 0;

  return (
    <div className={cn("space-y-4", className)}>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group bg-muted relative aspect-square overflow-hidden rounded-lg border"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeImage(index)}
                disabled={disabled || isUploading}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <label
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center p-8",
              (disabled || isUploading) && "cursor-not-allowed"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
              disabled={disabled || isUploading}
              className="sr-only"
            />

            {isUploading ? (
              <>
                <Loader2 className="text-muted-foreground mb-3 size-10 animate-spin" />
                <p className="text-sm font-medium">Uploading...</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {uploadProgress}% complete
                </p>
              </>
            ) : (
              <>
                <div className="bg-muted mb-3 flex size-12 items-center justify-center rounded-full">
                  {isDragging ? (
                    <ImageIcon className="text-primary size-6" />
                  ) : (
                    <Upload className="text-muted-foreground size-6" />
                  )}
                </div>
                <p className="text-sm font-medium">
                  {isDragging
                    ? "Drop images here"
                    : "Click or drag images to upload"}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {multiple
                    ? `Up to ${maxFiles} images • PNG, JPG, WebP`
                    : "PNG, JPG, WebP"}
                </p>
              </>
            )}
          </label>
        </div>
      )}

      {isUploading && uploadProgress > 0 && (
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
