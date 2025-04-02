"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/common/Container';
import { MyAlbumsHeader } from '@/components/my-albums/MyAlbumsHeader';
import { MyAlbumsGrid } from '@/components/my-albums/MyAlbumsGrid';
import { MyAlbumsEmptyState } from '@/components/my-albums/MyAlbumsEmptyState';
import { UploadPhotosDialog } from '@/components/my-albums/UploadPhotosDialog';
import { MyAlbum, getMyAlbums, createAlbum, getMyAlbumById, updateAlbumDetails } from '@/data/my-albums';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Check, AlertTriangle } from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a' | 'most-photos' | 'recently-updated';

export default function MyAlbumsPage() {
  const { user } = useUser();
  
  const [albums, setAlbums] = useState<MyAlbum[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<MyAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('recently-updated');
  
  // Upload dialog state
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<MyAlbum | null>(null);
  
  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const myAlbums = getMyAlbums();
      setAlbums(myAlbums);
      setFilteredAlbums(sortAlbums(myAlbums, sortOption));
      
      setIsLoading(false);
    };
    
    fetchAlbums();
  }, []);
  
  // Filter and sort albums when search term or sort option changes
  useEffect(() => {
    if (albums.length === 0) return;
    
    // Filter by search term
    let filtered = albums;
    if (searchTerm) {
      filtered = albums.filter(album => 
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (album.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }
    
    // Sort filtered albums
    setFilteredAlbums(sortAlbums(filtered, sortOption));
  }, [albums, searchTerm, sortOption]);
  
  const sortAlbums = (albumsToSort: MyAlbum[], option: SortOption): MyAlbum[] => {
    return [...albumsToSort].sort((a, b) => {
      switch (option) {
        case 'newest':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'oldest':
          return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        case 'most-photos':
          return b.photoCount - a.photoCount;
        case 'recently-updated':
          return new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime();
        default:
          return 0;
      }
    });
  };
  
  const handleCreateAlbum = (title: string, description: string, isPrivate: boolean) => {
    const newAlbum = createAlbum(title, description, isPrivate);
    
    setAlbums(prevAlbums => {
      const updatedAlbums = [...prevAlbums, newAlbum];
      return updatedAlbums;
    });
    
    toast.success('Album created', {
      description: `"${title}" has been created successfully.`,
      icon: <Check className="h-4 w-4" />,
      position: 'bottom-right',
    });
  };
  
  const handleUpdateAlbum = (albumId: number, updates: Partial<MyAlbum>) => {
    const updatedAlbum = updateAlbumDetails(albumId, updates);
    
    if (updatedAlbum) {
      setAlbums(prevAlbums => 
        prevAlbums.map(album => 
          album.id === albumId ? updatedAlbum : album
        )
      );
      
      toast.success('Album updated', {
        description: `"${updatedAlbum.title}" has been updated successfully.`,
        icon: <Check className="h-4 w-4" />,
        position: 'bottom-right',
      });
    }
  };
  
  const handleDeleteAlbum = (albumId: number) => {
    // In a real app, you'd make an API call to delete the album
    const albumToDelete = albums.find(a => a.id === albumId);
    
    setAlbums(prevAlbums => 
      prevAlbums.filter(album => album.id !== albumId)
    );
    
    toast('Album deleted', {
      description: albumToDelete ? `"${albumToDelete.title}" has been deleted.` : "The album has been deleted.",
      icon: <AlertTriangle className="h-4 w-4" />,
      position: 'bottom-right',
    });
  };
  
  const handleAddPhotos = (albumId: number) => {
    const album = getMyAlbumById(albumId);
    if (album) {
      setSelectedAlbum(album);
      setIsUploadDialogOpen(true);
    }
  };
  
  const handleUploadComplete = () => {
    if (selectedAlbum) {
      // Simulate adding photos to the album
      const photosAdded = Math.floor(Math.random() * 5) + 1;
      const updatedAlbum = {
        ...selectedAlbum,
        photoCount: selectedAlbum.photoCount + photosAdded,
        dateUpdated: new Date().toISOString().split('T')[0]
      };
      
      setAlbums(prevAlbums => 
        prevAlbums.map(album => 
          album.id === selectedAlbum.id ? updatedAlbum : album
        )
      );
      
      toast.success('Upload complete', {
        description: `${photosAdded} photos added to "${selectedAlbum.title}" successfully.`,
        icon: <Check className="h-4 w-4" />,
        position: 'bottom-right',
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-photo-primary pb-16">
      {/* Header section */}
      <MyAlbumsHeader
        albumCount={filteredAlbums.length}
        searchTerm={searchTerm}
        sortOption={sortOption}
        onSearchChange={setSearchTerm}
        onSortChange={(value) => setSortOption(value as SortOption)}
        onCreateAlbum={handleCreateAlbum}
      />
      
      {/* Main content */}
      <Container className="mt-8">
        {albums.length === 0 && !isLoading ? (
          <MyAlbumsEmptyState 
            onCreateAlbum={() => {
              document.getElementById('create-album-dialog-trigger')?.click();
            }} 
          />
        ) : (
          <MyAlbumsGrid 
            albums={filteredAlbums}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onCreateAlbum={() => {
              document.getElementById('create-album-dialog-trigger')?.click();
            }}
            onUpdateAlbum={handleUpdateAlbum}
            onDeleteAlbum={handleDeleteAlbum}
            onAddPhotos={handleAddPhotos}
          />
        )}
      </Container>
      
      {/* Upload Photos Dialog */}
      <UploadPhotosDialog 
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        album={selectedAlbum}
        onUploadComplete={handleUploadComplete}
      />
      
      {/* Hidden trigger for create album dialog */}
      <button 
        id="create-album-dialog-trigger" 
        className="hidden"
        onClick={() => {
          document.querySelector<HTMLButtonElement>('[data-dialog-trigger="create-album"]')?.click();
        }}
      />
    </div>
  );
}