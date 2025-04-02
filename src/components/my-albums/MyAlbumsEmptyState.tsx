import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderPlus, Upload } from 'lucide-react';

interface MyAlbumsEmptyStateProps {
  onCreateAlbum: () => void;
}

export function MyAlbumsEmptyState({ onCreateAlbum }: MyAlbumsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-photo-darkgray/20 flex items-center justify-center mx-auto mb-6">
          <FolderPlus className="h-10 w-10 text-photo-secondary/40" />
        </div>
        
        <h2 className="text-xl font-semibold text-photo-secondary mb-3">No albums yet</h2>
        <p className="text-photo-secondary/60 max-w-md mx-auto">
          Create your first album to organize your photos and share them with others.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          className="bg-photo-indigo hover:bg-photo-indigo/90"
          onClick={onCreateAlbum}
          size="lg"
        >
          <FolderPlus className="h-5 w-5 mr-2" />
          Create First Album
        </Button>
        
        <Button
          variant="outline"
          size="lg"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Photos
        </Button>
      </div>
    </div>
  );
}