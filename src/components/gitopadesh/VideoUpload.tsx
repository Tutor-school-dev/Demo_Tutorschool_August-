"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function VideoUpload({ onFileSelect, selectedFile }: VideoUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  } as any);

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "p-8 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer",
            isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          )}
        >
          <input {...(getInputProps() as any)} />
          <Upload className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
          <div className="space-y-2">
            <p className="font-medium text-lg">Upload Video</p>
            <p className="text-muted-foreground text-sm">Drag & drop your MP4 video, or click to browse</p>
            <p className="text-muted-foreground text-xs">Maximum file size: 50MB • MP4 format only</p>
          </div>
        </div>
      ) : (
        <div className="bg-accent/50 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FileVideo className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-muted-foreground text-xs">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}