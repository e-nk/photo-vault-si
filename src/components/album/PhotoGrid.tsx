"use client";

import React, { useState, useEffect } from 'react';
import { Photo } from '@/data/dummy-photos';
import { PhotoCard } from '@/components/album/PhotoCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Rows, Columns, LayoutGrid } from 'lucide-react';
import { Heart, MessageCircle, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PhotoGridProps {
  photos: Photo[];
  isLoading?: boolean;
}

type GridLayout = 'masonry' | 'uniform' | 'rows' | 'columns';

export function PhotoGrid({ photos, isLoading = false }: PhotoGridProps) {
  const [selectedLayout, setSelectedLayout] = useState<GridLayout>('masonry');
  
  // For masonry layout, we need to classify photos by aspect ratio
  const getGridClass = () => {
    switch (selectedLayout) {
      case 'masonry':
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-4";
      case 'uniform':
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case 'rows':
        return "flex flex-col gap-4";
      case 'columns':
        return "grid grid-cols-1 md:grid-cols-2 gap-4";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-4";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, index) => (
          <div 
            key={index} 
            className="bg-photo-darkgray/10 rounded-lg border border-photo-border/20 animate-pulse"
            style={{ height: `${Math.floor(Math.random() * 100) + 200}px` }} 
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-photo-secondary/60 text-lg mb-2">No photos found</h3>
        <p className="text-photo-secondary/50 text-sm">This album is empty.</p>
      </div>
    );
  }

  const renderRows = () => {
    return (
      <div className="flex flex-col gap-6">
        {photos.map((photo, index) => (
          <div key={photo.id} className="flex flex-col">
            <div className="relative">
              <img 
                src={photo.url} 
                alt={photo.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>
            <div className="mt-3">
              <h3 className="text-photo-secondary font-medium mb-1">{photo.title}</h3>
              {photo.description && (
                <p className="text-photo-secondary/70 text-sm mb-2">{photo.description}</p>
              )}
              <div className="flex items-center gap-4 text-photo-secondary/60 text-xs mt-2">
                <div className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  <span>{photo.likes}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  <span>{photo.comments}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDistanceToNow(new Date(photo.dateUploaded), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-6 gap-2">
        <div className="flex border border-photo-border/30 rounded-md overflow-hidden">
          <Button 
            variant={selectedLayout === 'masonry' ? 'secondary' : 'ghost'} 
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={() => setSelectedLayout('masonry')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={selectedLayout === 'uniform' ? 'secondary' : 'ghost'} 
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={() => setSelectedLayout('uniform')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={selectedLayout === 'rows' ? 'secondary' : 'ghost'} 
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={() => setSelectedLayout('rows')}
          >
            <Rows className="h-4 w-4" />
          </Button>
          <Button 
            variant={selectedLayout === 'columns' ? 'secondary' : 'ghost'} 
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={() => setSelectedLayout('columns')}
          >
            <Columns className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {selectedLayout === 'rows' ? (
        renderRows()
      ) : (
        <div className={getGridClass()}>
          {photos.map((photo, index) => (
            <PhotoCard key={photo.id} photo={photo} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}