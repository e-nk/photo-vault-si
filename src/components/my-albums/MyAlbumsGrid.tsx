import React from 'react';
import { MyAlbum } from '@/data/my-albums';
import { MyAlbumCard } from '@/components/my-albums/MyAlbumCard';
import { Button } from '@/components/ui/button';
import { FolderPlus } from 'lucide-react';

interface MyAlbumsGridProps {
  albums: MyAlbum[];
  isLoading?: boolean;
  searchTerm: string;
  onCreateAlbum: () => void;
  onUpdateAlbum: (albumId: number, updates: Partial<MyAlbum>) => void;
  onDeleteAlbum: (albumId: number) => void;
  onAddPhotos: (albumId: number) => void;
}

export function MyAlbumsGrid({
  albums,
  isLoading = false,
  searchTerm,
  onCreateAlbum,
  onUpdateAlbum,
  onDeleteAlbum,
  onAddPhotos
}: MyAlbumsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="bg-photo-darkgray/10 rounded-lg border border-photo-border/20 animate-pulse"
            style={{ height: '300px' }} 
          />
        ))}
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="py-16 text-center">
        {searchTerm ? (
          <>
            <h3 className="text-photo-secondary/60 text-lg mb-2">No albums matching "{searchTerm}"</h3>
            <p className="text-photo-secondary/50 text-sm">Try a different search term or clear your search.</p>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-photo-darkgray/20 flex items-center justify-center mb-4">
              <FolderPlus className="h-8 w-8 text-photo-secondary/50" />
            </div>
            <h3 className="text-photo-secondary/60 text-lg mb-2">You haven't created any albums yet</h3>
            <p className="text-photo-secondary/50 text-sm mb-6">Create your first album to organize your photos.</p>
            <Button 
              className="bg-photo-indigo hover:bg-photo-indigo/90"
              onClick={onCreateAlbum}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Create First Album
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {albums.map(album => (
        <MyAlbumCard
          key={album.id}
          album={album}
          onUpdate={onUpdateAlbum}
          onDelete={onDeleteAlbum}
          onAddPhotos={onAddPhotos}
        />
      ))}
    </div>
  );
}