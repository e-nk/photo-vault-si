import React from 'react';
import { AlbumCard } from '@/components/user/AlbumCard';
import { Album } from '@/data/dummy-albums';

interface AlbumsGridProps {
  albums: Album[];
  isLoading?: boolean;
}

export function AlbumsGrid({ albums, isLoading = false }: AlbumsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="bg-photo-darkgray/10 rounded-lg border border-photo-border/20 animate-pulse"
            style={{ height: '280px' }} 
          />
        ))}
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-photo-secondary/60 text-lg mb-2">No albums found</h3>
        <p className="text-photo-secondary/50 text-sm">This user hasn't created any albums yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {albums.map(album => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}