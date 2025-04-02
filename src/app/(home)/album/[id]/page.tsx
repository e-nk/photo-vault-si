"use client";

import React, { useEffect, useState } from 'react';
import { Album } from '@/data/dummy-albums';
import { User } from '@/data/dummy-users';
import { Photo } from '@/data/dummy-photos';
import { AlbumHeader } from '@/components/album/AlbumHeader';
import { PhotoGrid } from '@/components/album/PhotoGrid';
import { getDummyPhotosForAlbum } from '@/data/dummy-photos';
import { getAllDummyAlbums } from '@/data/dummy-albums';
import { dummyUsers } from '@/data/dummy-users';
import { notFound } from 'next/navigation';
import Container from '@/components/common/Container';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Filter, Download, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AlbumPageProps {
  params: {
    id: string;
  };
}

type SortOption = 'newest' | 'oldest' | 'most-liked' | 'most-commented';

export default function AlbumPage({ params }: AlbumPageProps) {
  const albumId = parseInt(params.id, 10);
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  useEffect(() => {
    // Simulate API call to fetch album, user, and photos
    const fetchData = async () => {
      setIsLoading(true);
      
      // Delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allAlbums = getAllDummyAlbums();
      const foundAlbum = allAlbums.find(a => a.id === albumId);
      
      if (!foundAlbum) {
        return notFound();
      }
      
      setAlbum(foundAlbum);
      
      const foundUser = dummyUsers.find(u => u.id === foundAlbum.userId);
      if (foundUser) {
        setUser(foundUser);
      }
      
      const albumPhotos = getDummyPhotosForAlbum(albumId);
      setPhotos(albumPhotos);
      setFilteredPhotos(albumPhotos);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [albumId]);

  // Filter and sort photos when search term or sort option changes
  useEffect(() => {
    if (photos.length === 0) return;

    // Filter by search term
    let filtered = photos;
    if (searchTerm) {
      filtered = photos.filter(photo => 
        photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    // Sort based on selected option
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime();
        case 'oldest':
          return new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime();
        case 'most-liked':
          return b.likes - a.likes;
        case 'most-commented':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

    setFilteredPhotos(filtered);
  }, [photos, searchTerm, sortOption]);

  // Show loading state
  if (isLoading || !album || !user) {
    return (
      <div className="min-h-screen bg-photo-primary animate-pulse">
        <div className="pt-8 pb-4 border-b border-photo-border/20">
          <Container>
            <div className="h-8 w-32 bg-photo-darkgray/30 mb-6 rounded" />
            <div className="h-10 w-64 bg-photo-darkgray/30 mb-6 rounded" />
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center border-t border-photo-border/10 pt-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-photo-darkgray/30 mr-3" />
                <div>
                  <div className="h-4 w-24 bg-photo-darkgray/30 mb-2 rounded" />
                  <div className="h-3 w-16 bg-photo-darkgray/30 rounded" />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-photo-primary pb-16">
      {/* Album Header */}
      <AlbumHeader 
        album={album} 
        user={user} 
        totalPhotos={photos.length} 
      />
      
      {/* Photos Section */}
      <div className="py-8">
        <Container>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-photo-secondary/50 h-4 w-4" />
              <Input
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-photo-darkgray/30 border-photo-border text-photo-secondary"
              />
            </div>
            
            <div className="flex gap-2 items-center ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <SortDesc className="h-4 w-4 mr-1" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={sortOption} onValueChange={val => setSortOption(val as SortOption)}>
                    <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="most-liked">Most liked</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="most-commented">Most commented</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioItem value="all">All photos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="with-description">With description</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="most-engagement">Most engagement</DropdownMenuRadioItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4 mr-1" />
                Download All
              </Button>
            </div>
          </div>
          
          {/* Results count */}
          <p className="text-photo-secondary/60 text-sm mb-6">
            Showing {filteredPhotos.length} photos
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
          
          {/* Photos Grid */}
          <PhotoGrid photos={filteredPhotos} isLoading={isLoading} />
        </Container>
      </div>
    </div>
  );
}