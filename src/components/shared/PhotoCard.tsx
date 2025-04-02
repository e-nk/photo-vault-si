"use client";

import React from 'react';
import { Photo } from '@/data/dummy-photos';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Heart, MessageCircle, Edit, Trash2, Download, 
  MoreHorizontal, Calendar, Eye, Bookmark, Share2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PhotoCardProps {
  photo: Photo;
  index?: number;
  layout?: 'masonry' | 'uniform' | 'rows' | 'columns';
  isOwner?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function PhotoCard({ 
  photo, 
  index = 0,
  layout = 'masonry',
  isOwner = false,
  isSelectable = false,
  isSelected = false,
  onToggleSelect
}: PhotoCardProps) {
  const router = useRouter();
  const formattedDate = formatDistanceToNow(new Date(photo.dateUploaded), { addSuffix: true });
  
  // Selection mode is active if both isSelectable is true and onToggleSelect is provided
  const selectionMode = isSelectable && !!onToggleSelect;
  
  const handlePhotoClick = () => {
    if (selectionMode) {
      onToggleSelect?.();
    } else {
      router.push(`/photo/${photo.id}`);
    }
  };
  
  // Calculate the span for masonry layout based on aspect ratio
  const getSpanClass = () => {
    if (layout !== 'masonry' || !photo.aspectRatio) return '';
    
    if (photo.aspectRatio > 1.7) return 'col-span-2';
    if (photo.aspectRatio < 0.7) return 'row-span-2';
    
    return '';
  };
  
  // For rows layout render a different component
  if (layout === 'rows') {
    return (
      <div className="flex flex-col">
        <div className="flex items-start gap-4 p-4 bg-photo-darkgray/20 border border-photo-border/30 rounded-lg">
          <div className="relative flex-shrink-0">
            {selectionMode && (
              <div 
                className="absolute top-2 left-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect?.();
                }}
              >
                <Checkbox checked={isSelected} />
              </div>
            )}
            <div 
              className="relative overflow-hidden cursor-pointer" 
              onClick={handlePhotoClick}
              style={{ width: '180px', height: '120px' }}
            >
              <img 
                src={photo.thumbnailUrl} 
                alt={photo.title}
                className={`w-full h-full object-cover rounded-md ${isSelected ? 'opacity-80 ring-2 ring-photo-indigo' : 'opacity-100'}`}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-photo-secondary font-medium truncate mb-1">{photo.title}</h3>
            
            {photo.description && (
              <p className="text-photo-secondary/70 text-sm line-clamp-2 mb-2">
                {photo.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-photo-secondary/60 mt-2">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formattedDate}</span>
              </div>
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
          
          {!selectionMode && (
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/photo/${photo.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View details
                  </DropdownMenuItem>
                  
                  {isOwner && (
                    <DropdownMenuItem onClick={() => router.push(`/photo/${photo.id}/edit`)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit details
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  
                  {!isOwner && (
                    <DropdownMenuItem>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  
                  {isOwner && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete photo
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default grid/masonry layout
  return (
    <Card 
      className={`overflow-hidden group relative bg-photo-darkgray/20 border-photo-border ${getSpanClass()} ${isSelected ? 'ring-2 ring-photo-indigo' : ''}`}
    >
      <div 
        className="relative cursor-pointer" 
        onClick={handlePhotoClick}
      >
        <div className="aspect-ratio-container" style={{ 
          paddingBottom: photo.aspectRatio ? `${(1 / photo.aspectRatio) * 100}%` : '75%' 
        }}>
          <img 
            src={photo.url} 
            alt={photo.title}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSelected ? 'opacity-80' : 'opacity-100'}`}
          />
        </div>
        
        {/* Selection checkbox */}
        {selectionMode && (
          <div 
            className="absolute top-3 left-3 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
          >
            <Checkbox checked={isSelected} />
          </div>
        )}
        
        {/* Gradient overlays for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Photo title - visible on hover */}
        <div className="absolute top-0 left-0 right-0 p-4 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-medium line-clamp-2">{photo.title}</h3>
        </div>
        
        {/* Photo actions - visible on hover when not in selection mode */}
        {!selectionMode && (
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center">
            <div className="flex gap-2">
              {isOwner ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/photo/${photo.id}/edit`);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle download
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
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
                      // Handle save action
                    }}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-white/90 text-xs">
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
        )}
        
        {/* Stats - always visible when not hovering */}
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