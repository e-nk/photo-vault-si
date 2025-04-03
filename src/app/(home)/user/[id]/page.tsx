// app/(home)/user/[id]/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Container from '@/components/common/Container';
import { AlbumHeader } from '@/components/shared/AlbumHeader';
import { PhotoGrid } from '@/components/shared/PhotoGrid';

export default function UserPage({ params }) {
  const userId = params.id;
  
  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true);
      
      // Fetch user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (userError || !userData) {
        return notFound();
      }
      
      setUser(userData);
      
      // Fetch user's albums
      const { data: albumsData } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', userId)
        .eq('is_private', false) // Only fetch public albums
        .order('updated_at', { ascending: false });
        
      setAlbums(albumsData || []);
      setIsLoading(false);
    }
    
    fetchUserData();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-photo-primary">
      {/* User profile section */}
      <div className="py-8 border-b border-photo-border/20">
        <Container>
          <div className="flex items-center gap-4">
            <img 
              src={user.avatar_url || '/placeholder-avatar.jpg'} 
              alt={user.full_name} 
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-photo-secondary">{user.full_name}</h1>
              <p className="text-photo-secondary/60">@{user.username}</p>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Albums section */}
      <div className="py-8">
        <Container>
          <h2 className="text-xl font-semibold text-photo-secondary mb-6">Albums</h2>
          
          {albums.length === 0 ? (
            <p className="text-photo-secondary/60">This user hasn't shared any albums yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map(album => (
                <div 
                  key={album.id}
                  className="bg-photo-darkgray/20 border border-photo-border rounded-lg overflow-hidden"
                >
                  <img 
                    src={album.cover_photo_url || '/placeholder-album.jpg'} 
                    alt={album.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-photo-secondary">{album.title}</h3>
                    <p className="text-photo-secondary/60 text-sm mt-1">{album.photo_count} photos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}