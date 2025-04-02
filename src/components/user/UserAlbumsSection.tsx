"use client";

import React, { useState } from 'react';
import { Album } from '@/data/dummy-albums';
import { AlbumsGrid } from '@/components/user/AlbumsGrid';
import { Input } from '@/components/ui/input';
import { Search, Grid, List, Calendar, SortAsc, SortDesc } from 'lucide-react';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserAlbumsSectionProps {
  albums: Album[];
  isLoading?: boolean;
}

type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a' | 'most-photos' | 'least-photos';

export function UserAlbumsSection({ albums, isLoading = false }: UserAlbumsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Filter albums based on search term
  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort albums based on sort option
  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    switch (sortOption) {
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
      case 'least-photos':
        return a.photoCount - b.photoCount;
      default:
        return 0;
    }
  });

  return (
    <div className="py-8">
      <Container>
        <Tabs defaultValue="albums" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList className="bg-photo-darkgray/30">
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>

            <div className="flex gap-2 items-center">
              <Button
                variant={viewType === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewType('grid')}
                className="h-9 w-9"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewType('list')}
                className="h-9 w-9"
              >
                <List className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 ml-2">
                    {sortOption === 'newest' || sortOption === 'oldest' ? (
                      <Calendar className="h-4 w-4 mr-1" />
                    ) : sortOption === 'a-z' ? (
                      <SortAsc className="h-4 w-4 mr-1" />
                    ) : sortOption === 'z-a' ? (
                      <SortDesc className="h-4 w-4 mr-1" />
                    ) : (
                      <SortAsc className="h-4 w-4 mr-1" />
                    )}
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={sortOption} onValueChange={val => setSortOption(val as SortOption)}>
                    <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="a-z">A to Z</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="z-a">Z to A</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="most-photos">Most photos</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="least-photos">Least photos</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="relative mb-8 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-photo-secondary/50 h-4 w-4" />
            <Input
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-photo-darkgray/30 border-photo-border text-photo-secondary"
            />
          </div>

          <TabsContent value="albums">
            <AlbumsGrid albums={sortedAlbums} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="text-center py-16">
              <h3 className="text-photo-secondary/60 text-lg mb-2">No favorite albums yet</h3>
              <p className="text-photo-secondary/50 text-sm">This user hasn't marked any albums as favorites.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <AlbumsGrid 
              albums={sortedAlbums.slice(0, 4)} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}