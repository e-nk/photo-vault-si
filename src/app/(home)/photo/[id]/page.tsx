"use client";

import React, { useEffect, useState } from 'react';
import { Photo } from '@/data/dummy-photos';
import { User } from '@/data/dummy-users';
import { Album } from '@/data/dummy-albums';
import { notFound, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { PhotoHeader } from '@/components/photo/PhotoHeader';
import { PhotoView } from '@/components/photo/PhotoView';
import { PhotoSidebar } from '@/components/photo/PhotoSidebar';
import { PhotoLoading } from '@/components/photo/PhotoLoading';
import { getDummyPhotosForAlbum } from '@/data/dummy-photos';
import { getAllDummyAlbums } from '@/data/dummy-albums';
import { dummyUsers } from '@/data/dummy-users';

interface PhotoPageProps {
  params: {
    id: string;
  };
}

export default function PhotoPage({ params }: PhotoPageProps) {
  const photoId = parseInt(params.id, 10);
  const router = useRouter();
  const { user: currentUser, isSignedIn } = useUser();
  
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Get current photo index and prev/next photos
  const currentIndex = albumPhotos.findIndex(p => p.id === photoId);
  const prevPhoto = currentIndex > 0 ? albumPhotos[currentIndex - 1] : null;
  const nextPhoto = currentIndex < albumPhotos.length - 1 ? albumPhotos[currentIndex + 1] : null;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the photo
      const allAlbums = getAllDummyAlbums();
      let foundPhoto: Photo | null = null;
      let foundAlbum: Album | null = null;
      
      // Look through each album to find the photo
      for (const album of allAlbums) {
        const photos = getDummyPhotosForAlbum(album.id);
        const photo = photos.find(p => p.id === photoId);
        
        if (photo) {
          foundPhoto = photo;
          foundAlbum = album;
          setAlbumPhotos(photos);
          break;
        }
      }
      
      if (!foundPhoto || !foundAlbum) {
        return notFound();
      }
      
      setPhoto(foundPhoto);
      setAlbum(foundAlbum);
      setEditedTitle(foundPhoto.title);
      setEditedDescription(foundPhoto.description || "");
      
      // Find the user who owns the album
      const foundUser = dummyUsers.find(u => u.id === foundAlbum.userId);
      if (foundUser) {
        setUser(foundUser);
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [photoId]);

  const isOwner = () => {
    if (!isSignedIn || !user || !currentUser) return false;
    // In a real app, you'd compare user IDs
    // For demo purposes, let's pretend the current user is the owner
    return true; 
  };

  const handleSaveEdit = async () => {
    // In a real app, you'd make an API call to update the photo
    if (!photo) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPhoto({
      ...photo,
      title: editedTitle,
      description: editedDescription
    });
    
    setIsEditing(false);
  };

  const navigateToPrevPhoto = () => {
    if (prevPhoto) {
      router.push(`/photo/${prevPhoto.id}`);
    }
  };

  const navigateToNextPhoto = () => {
    if (nextPhoto) {
      router.push(`/photo/${nextPhoto.id}`);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateToPrevPhoto();
      } else if (e.key === 'ArrowRight') {
        navigateToNextPhoto();
      } else if (e.key === 'Escape' && isEditing) {
        setIsEditing(false);
        setEditedTitle(photo?.title || "");
        setEditedDescription(photo?.description || "");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateToPrevPhoto, navigateToNextPhoto, isEditing, photo]);

  if (isLoading || !photo || !album || !user) {
    return <PhotoLoading />;
  }

  return (
    <div className="min-h-screen bg-photo-primary flex flex-col">
      {/* Photo Header */}
      <PhotoHeader 
        photo={photo}
        album={album}
        isLiked={isLiked}
        isSaved={isSaved}
        isOwner={isOwner()}
        isEditing={isEditing}
        onToggleLike={() => setIsLiked(!isLiked)}
        onToggleSave={() => setIsSaved(!isSaved)}
        onStartEditing={() => setIsEditing(true)}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Photo View */}
        <PhotoView 
          photo={photo}
          prevPhoto={prevPhoto}
          nextPhoto={nextPhoto}
          onNavigatePrev={navigateToPrevPhoto}
          onNavigateNext={navigateToNextPhoto}
        />
        
        {/* Photo Sidebar */}
        <PhotoSidebar 
          photo={photo}
          album={album}
          user={user}
          prevPhoto={prevPhoto}
          nextPhoto={nextPhoto}
          isEditing={isEditing}
          isOwner={isOwner()}
          editedTitle={editedTitle}
          editedDescription={editedDescription}
          onTitleChange={setEditedTitle}
          onDescriptionChange={setEditedDescription}
          onCancelEdit={() => {
            setIsEditing(false);
            setEditedTitle(photo.title);
            setEditedDescription(photo.description || "");
          }}
          onSaveEdit={handleSaveEdit}
          onStartEditing={() => setIsEditing(true)}
          onNavigatePrev={navigateToPrevPhoto}
          onNavigateNext={navigateToNextPhoto}
        />
      </div>
    </div>
  );
}