"use client";

import React from 'react';
import { Photo } from '@/data/dummy-photos';
import { Album } from '@/data/dummy-albums';
import { 
  ArrowLeft, Heart, Bookmark, Share2, MoreHorizontal, Download, Edit 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

interface PhotoHeaderProps {
  photo: Photo;
  album: Album;
  isLiked: boolean;
  isSaved: boolean;
  isOwner: boolean;
  isEditing: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onStartEditing: () => void;
}

export function PhotoHeader({ 
  photo, 
  album, 
  isLiked,
  isSaved,
  isOwner,
  isEditing,
  onToggleLike,
  onToggleSave,
  onStartEditing
}: PhotoHeaderProps) {
  return (
    <div className="border-b border-photo-border/20 bg-photo-primary/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            href={`/album/${album.id}`}
            className="text-photo-secondary/70 hover:text-photo-secondary flex items-center transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to album
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={isLiked ? "default" : "ghost"} 
            size="sm" 
            className={isLiked ? "bg-rose-500 hover:bg-rose-600" : ""}
            onClick={onToggleLike}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
            {isLiked ? "Liked" : "Like"}
          </Button>
          
          <Button 
            variant={isSaved ? "default" : "ghost"} 
            size="sm"
            className={isSaved ? "bg-photo-indigo hover:bg-photo-indigo/90" : ""} 
            onClick={onToggleSave}
          >
            <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
          
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              {isOwner && !isEditing && (
                <DropdownMenuItem onClick={onStartEditing}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit details
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Report content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}