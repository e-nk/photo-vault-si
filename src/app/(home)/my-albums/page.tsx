// app/(home)/my-albums/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/common/Container';
import { MyAlbumsHeader } from '@/components/my-albums/MyAlbumsHeader';
import { MyAlbumsGrid } from '@/components/my-albums/MyAlbumsGrid';
import { UploadPhotosDialog } from '@/components/my-albums/UploadPhotosDialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { createAlbum, updateAlbum, deleteAlbum } from '@/lib/api';

export default function MyAlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recently-updated');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    setIsLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
      
    if (!error) {
      setAlbums(data || []);
      setFilteredAlbums(sortAlbums(data || [], sortOption));
    }
    
    setIsLoading(false);
  }

  // Filter and sort albums
  useEffect(() => {
    if (albums.length === 0) return;
    
    let filtered = albums;
    if (searchTerm) {
      filtered = albums.filter(album => 
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (album.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }
    
    setFilteredAlbums(sortAlbums(filtered, sortOption));
  }, [albums, searchTerm, sortOption]);

  const sortAlbums = (albumsToSort, option) => {
    return [...albumsToSort].sort((a, b) => {
      switch (option) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        case 'most-photos':
          return b.photo_count - a.photo_count;
        case 'recently-updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });
  };

  const handleCreateAlbum = async (title, description, isPrivate) => {
    try {
      const newAlbum = await createAlbum(title, description, isPrivate);
      setAlbums(prev => [newAlbum, ...prev]);
      
      toast.success('Album created', {
        description: `"${title}" has been created successfully.`,
      });
    } catch (error) {
      toast.error('Failed to create album', {
        description: error.message,
      });
    }
  };

  const handleUpdateAlbum = async (albumId, updates) => {
    try {
      const updatedAlbum = await updateAlbum(albumId, updates);
      
      setAlbums(prev => 
        prev.map(album => 
          album.id === albumId ? updatedAlbum : album
        )
      );
      
      toast.success('Album updated', {
        description: `"${updatedAlbum.title}" has been updated successfully.`,
      });
    } catch (error) {
      toast.error('Failed to update album', {
        description: error.message,
      });
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    try {
      await deleteAlbum(albumId);
      
      setAlbums(prev => 
        prev.filter(album => album.id !== albumId)
      );
      
      toast('Album deleted', {
        description: "The album has been deleted successfully.",
      });
    } catch (error) {
      toast.error('Failed to delete album', {
        description: error.message,
      });
    }
  };

  const handleAddPhotos = (albumId) => {
    const album = albums.find(a => a.id === albumId);
    if (album) {
      setSelectedAlbum(album);
      setIsUploadDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-photo-primary pb-16">
      <MyAlbumsHeader
        albumCount={filteredAlbums.length}
        searchTerm={searchTerm}
        sortOption={sortOption}
        onSearchChange={setSearchTerm}
        onSortChange={setSortOption}
        onCreateAlbum={handleCreateAlbum}
      />
      
      <Container className="mt-8">
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
      </Container>
      
      {selectedAlbum && (
        <UploadPhotosDialog 
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          album={selectedAlbum}
          onUploadComplete={() => {
            fetchAlbums();
            setIsUploadDialogOpen(false);
          }}
        />
      )}
      
      <button 
        id="create-album-dialog-trigger" 
        className="hidden"
        onClick={() => {
          document.querySelector('[data-dialog-trigger="create-album"]')?.click();
        }}
      />
    </div>
  );
}