"use client";

import React from 'react';
import { Photo } from '@/data/dummy-photos';
import { Card } from '@/components/ui/card';
import { Heart, MessageCircle, Eye, Download, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface PhotoCardProps {
  photo: Photo;
  index: number;
}

export function PhotoCard({ photo, index }: PhotoCardProps) {
  const router = useRouter();
  const formattedDate = formatDistanceToNow(new Date(photo.dateUploaded), { addSuffix: true });
  
  const handleClick = () => {
    router.push(`/photo/${photo.id}`);
  };

  // Calculate the span for masonry layout based on aspect ratio
  const getSpanClass = () => {
    if (!photo.aspectRatio) return '';
    
    if (photo.aspectRatio > 1.7) return 'col-span-2';
    if (photo.aspectRatio < 0.7) return 'row-span-2';
    
    return '';
  };
  
  return (
    <Card 
      className={`overflow-hidden group relative bg-photo-darkgray/20 border-photo-border ${getSpanClass()}`}
      style={{
        height: photo.aspectRatio ? 'auto' : undefined,
      }}
    >
      <div 
        className="relative cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <div className="aspect-ratio-container" style={{ 
          paddingBottom: photo.aspectRatio ? `${(1 / photo.aspectRatio) * 100}%` : '75%' 
        }}>
          <img 
            src={photo.url} 
            alt={photo.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Gradients for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Title - visible on hover */}
        <div className="absolute top-0 left-0 right-0 p-4 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-medium text-shadow-sm line-clamp-2">{photo.title}</h3>
        </div>
        
        {/* Photo actions - visible on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center">
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                // Handle like action
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                // Handle comment action
              }}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                // Handle save action
              }}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                // Handle download action
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats - always visible */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white/90 text-xs opacity-70 group-hover:opacity-0 transition-opacity duration-300">
          <div className="flex items-center">
            <Heart className="h-3 w-3 mr-1" />
            <span>{photo.likes}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>{photo.comments}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}