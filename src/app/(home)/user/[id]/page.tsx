"use client";

import React, { useEffect, useState } from 'react';
import { User } from '@/data/dummy-users';
import { UserProfileHeader } from '@/components/user/UserProfileHeader';
import { UserAlbumsSection } from '@/components/user/UserAlbumsSection';
import { getDummyAlbumsForUser } from '@/data/dummy-albums';
import { dummyUsers } from '@/data/dummy-users';
import { Album } from '@/data/dummy-albums';
import { notFound, useRouter } from 'next/navigation';

interface UserPageProps {
  params: {
    id: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const userId = parseInt(params.id, 10);
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user and albums
    const fetchData = async () => {
      setIsLoading(true);
      
      // Delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = dummyUsers.find(u => u.id === userId);
      if (!foundUser) {
        return notFound();
      }
      
      setUser(foundUser);
      
      const userAlbums = getDummyAlbumsForUser(userId);
      setAlbums(userAlbums);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [userId]);

  // Calculate total photos count
  const totalPhotos = albums.reduce((sum, album) => sum + album.photoCount, 0);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-photo-primary animate-pulse">
        <div className="pb-6 pt-10 border-b border-photo-border/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="h-32 w-32 rounded-full bg-photo-darkgray/30" />
              <div className="flex-1">
                <div className="h-8 w-48 bg-photo-darkgray/30 mb-4 rounded" />
                <div className="h-4 w-32 bg-photo-darkgray/30 mb-2 rounded" />
                <div className="h-4 w-64 bg-photo-darkgray/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user not found in useEffect, the notFound function will be called
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-photo-primary pb-16">
      {/* User Profile Header */}
      <UserProfileHeader 
        user={user} 
        albumCount={albums.length} 
        totalPhotos={totalPhotos} 
      />
      
      {/* User Albums Section */}
      <UserAlbumsSection albums={albums} />
    </div>
  );
}