"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MyAlbum } from '@/data/my-albums';
import { Upload, X, Image, Check } from 'lucide-react';

interface UploadPhotosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  album: MyAlbum | null;
  onUploadComplete: () => void;
}

export function UploadPhotosDialog({
  isOpen,
  onClose,
  album,
  onUploadComplete
}: UploadPhotosDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          onUploadComplete();
          handleClose();
        }, 500);
      }
    }, 100);
  };
  
  const handleClose = () => {
    setFiles([]);
    setUploading(false);
    setUploadProgress(0);
    onClose();
  };

  if (!album) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-photo-primary border-photo-border text-photo-secondary">
        <DialogHeader>
          <DialogTitle>Upload Photos to {album.title}</DialogTitle>
          <DialogDescription className="text-photo-secondary/70">
            Add new photos to your album. You can select multiple files at once.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Upload area */}
          {!uploading && (
            <div className="border-2 border-dashed border-photo-border/50 rounded-lg p-8 text-center">
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-10 w-10 text-photo-secondary/50 mb-4" />
                <p className="text-photo-secondary font-medium">Drag photos here or click to browse</p>
                <p className="text-photo-secondary/60 text-sm mt-1">
                  Supports JPG, PNG, WebP formats
                </p>
              </label>
            </div>
          )}
          
          {/* Upload progress */}
          {uploading && (
            <div className="text-center py-4">
              <div className="w-full bg-photo-darkgray/30 rounded-full h-4 mb-4">
                <div
                  className="bg-photo-indigo h-4 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-photo-secondary">
                Uploading {files.length} photo{files.length !== 1 ? 's' : ''}...
              </p>
              <p className="text-photo-secondary/60 text-sm">
                {uploadProgress}% complete
              </p>
            </div>
          )}
          
          {/* Selected files */}
          {!uploading && files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-photo-secondary font-medium">
                  {files.length} photo{files.length !== 1 ? 's' : ''} selected
                </h4>
                <Button
                  variant="ghost"
                  className="text-xs text-photo-secondary/60 h-7"
                  onClick={() => setFiles([])}
                >
                  Clear all
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative border border-photo-border/30 rounded-md p-2 flex items-center"
                  >
                    <div className="h-8 w-8 bg-photo-darkgray/40 rounded flex items-center justify-center mr-2">
                      <Image className="h-4 w-4 text-photo-secondary/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-photo-secondary text-xs truncate">
                        {file.name}
                      </p>
                      <p className="text-photo-secondary/60 text-xs">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {!uploading && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="bg-photo-indigo hover:bg-photo-indigo/90"
                onClick={handleUpload}
                disabled={files.length === 0}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload {files.length > 0 ? `${files.length} Photo${files.length !== 1 ? 's' : ''}` : ''}
              </Button>
            </>
          )}
          
          {uploading && uploadProgress === 100 && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleClose}
            >
              <Check className="h-4 w-4 mr-2" />
              Upload Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}