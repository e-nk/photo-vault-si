// File path: /app/(home)/album/[id]/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { Album, getAllDummyAlbums } from '@/data/dummy-albums';
import { MyAlbum, getMyAlbumById, getPhotosForMyAlbum, updateAlbumDetails } from '@/data/my-albums';
import { User } from '@/data/dummy-users';
import { Photo, getDummyPhotosForAlbum } from '@/data/dummy-photos';
import { notFound, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { dummyUsers } from '@/data/dummy-users';
import { AlbumHeader } from '@/components/shared/AlbumHeader';
import { PhotoGrid } from '@/components/shared/PhotoGrid';
import { UploadPhotosDialog } from '@/components/my-albums/UploadPhotosDialog';
import { toast } from 'sonner';
import Container from '@/components/common/Container';
import { Check, Trash } from 'lucide-react';

interface AlbumPageProps {
  params: {
    id: string;
  };
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const albumId = parseInt(params.id, 10);
  const router = useRouter();
  const { user: currentUser, isSignedIn } = useUser();
  
  const [album, setAlbum] = useState<Album | MyAlbum | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Check my albums first (if user is logged in)
      if (isSignedIn) {
        const myAlbum = getMyAlbumById(albumId);
        if (myAlbum) {
          setAlbum(myAlbum);
          setIsOwner(true);
          setUser(dummyUsers.find(u => u.id === 1) || null); // Assuming current user is user 1
          const albumPhotos = getPhotosForMyAlbum(albumId);
          setPhotos(albumPhotos);
          setIsLoading(false);
          return;
        }
      }
      
      // If not found in my albums or not logged in, check public albums
      const allAlbums = getAllDummyAlbums();
      const foundAlbum = allAlbums.find(a => a.id === albumId);
      
      if (!foundAlbum) {
        return notFound();
      }
      
      setAlbum(foundAlbum);
      setIsOwner(false);
      
      const albumOwner = dummyUsers.find(u => u.id === foundAlbum.userId);
      if (albumOwner) {
        setUser(albumOwner);
      }
      
      const albumPhotos = getDummyPhotosForAlbum(albumId);
      setPhotos(albumPhotos);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [albumId, isSignedIn]);

  const handleUpdateAlbum = async (updates: Partial<MyAlbum>) => {
    if (!album || !isOwner) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if ('isPrivate' in album) {
      const updatedAlbum = updateAlbumDetails(albumId, updates);
      if (updatedAlbum) {
        setAlbum(updatedAlbum);
      }
    }
    
    toast.success('Album updated', {
      description: 'Your changes have been saved.',
      icon: <Check className="h-4 w-4" />,
      position: 'bottom-right',
    });
  };
  
  const handleDeleteAlbum = async () => {
    if (!album || !isOwner) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast('Album deleted', {
      description: `"${album.title}" has been permanently deleted.`,
      icon: <Trash className="h-4 w-4" />,
      position: 'bottom-right',
    });
    
    // Navigate back to my albums
    router.push('/my-albums');
  };
  
  const handlePhotoDelete = async (photoId: number) => {
    if (!isOwner) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove photo from state
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    
    // Update album photo count
    if (album && 'isPrivate' in album) {
      const updatedAlbum = {
        ...album,
        photoCount: album.photoCount - 1,
        dateUpdated: new Date().toISOString().split('T')[0]
      };
      setAlbum(updatedAlbum);
    }
    
    toast('Photo deleted', {
      description: 'The photo has been removed from this album.',
      icon: <Trash className="h-4 w-4" />,
      position: 'bottom-right',
    });
  };
  
  const handleMultiDelete = async (photoIds: number[]) => {
    if (!isOwner || photoIds.length === 0) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Remove photos from state
    setPhotos(prev => prev.filter(p => !photoIds.includes(p.id)));
    
    // Update album photo count
    if (album && 'isPrivate' in album) {
      const updatedAlbum = {
        ...album,
        photoCount: album.photoCount - photoIds.length,
        dateUpdated: new Date().toISOString().split('T')[0]
      };
      setAlbum(updatedAlbum);
    }
    
    toast('Photos deleted', {
      description: `${photoIds.length} photos have been removed from this album.`,
      icon: <Trash className="h-4 w-4" />,
      position: 'bottom-right',
    });
  };
  
  const handleUploadComplete = (newPhotos: number) => {
    if (!album || !isOwner) return;
    
    // Update album photo count
    if ('isPrivate' in album) {
      const updatedAlbum = {
        ...album,
        photoCount: album.photoCount + newPhotos,
        dateUpdated: new Date().toISOString().split('T')[0]
      };
      setAlbum(updatedAlbum);
    }
    
    // Simulate fetching updated photos
    const updatedPhotos = getPhotosForMyAlbum(albumId);
    setPhotos(updatedPhotos);
    
    toast.success('Photos uploaded', {
      description: `${newPhotos} photos have been added to this album.`,
      icon: <Check className="h-4 w-4" />,
      position: 'bottom-right',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-photo-primary animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-photo-indigo/30 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!album || !user) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-photo-primary">
      <AlbumHeader 
        album={album}
        user={user}
        totalPhotos={photos.length}
        isOwner={isOwner}
        backUrl={isOwner ? "/my-albums" : `/user/${user.id}`}
        onUpdate={isOwner ? handleUpdateAlbum : undefined}
        onDelete={isOwner ? handleDeleteAlbum : undefined}
        onUpload={isOwner ? () => setIsUploadDialogOpen(true) : undefined}
      />
      
      <Container className="py-8">
        <PhotoGrid 
          photos={photos}
          isLoading={isLoading}
          isOwner={isOwner}
          onPhotoDelete={isOwner ? handlePhotoDelete : undefined}
          onMultiDelete={isOwner ? handleMultiDelete : undefined}
          onUploadClick={isOwner ? () => setIsUploadDialogOpen(true) : undefined}
          emptyMessage={isOwner ? "This album is empty" : "No photos in this album yet"}
          emptyActionLabel={isOwner ? "Upload Photos" : undefined}
        />
      </Container>
      
      {/* Upload Photos Dialog - Only for owners */}
      {isOwner && album && 'isPrivate' in album && (
        <UploadPhotosDialog 
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          album={album}
          onUploadComplete={() => handleUploadComplete(Math.floor(Math.random() * 5) + 1)}
        />
      )}
    </div>
  );
}