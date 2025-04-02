"use client";

import React from 'react';
import { Photo } from '@/data/dummy-photos';
import { Album } from '@/data/dummy-albums';
import { User } from '@/data/dummy-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { 
  Calendar, Heart, MessageCircle, Edit, X, Check, ArrowLeft, ArrowRight 
} from 'lucide-react';

interface PhotoSidebarProps {
  photo: Photo;
  album: Album;
  user: User;
  prevPhoto: Photo | null;
  nextPhoto: Photo | null;
  isEditing: boolean;
  isOwner: boolean;
  editedTitle: string;
  editedDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStartEditing: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

export function PhotoSidebar({
  photo,
  album,
  user,
  prevPhoto,
  nextPhoto,
  isEditing,
  isOwner,
  editedTitle,
  editedDescription,
  onTitleChange,
  onDescriptionChange,
  onCancelEdit,
  onSaveEdit,
  onStartEditing,
  onNavigatePrev,
  onNavigateNext
}: PhotoSidebarProps) {
  const formattedDate = formatDistanceToNow(new Date(photo.dateUploaded), { addSuffix: true });

  return (
    <div className="w-full md:w-96 border-l border-photo-border/20 bg-photo-primary flex flex-col">
      {/* User info */}
      <div className="p-6 border-b border-photo-border/20">
        <div className="flex items-center">
          <Link href={`/user/${user.id}`}>
            <Avatar className="h-10 w-10 mr-3 border border-photo-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-photo-indigo/20 text-photo-secondary">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/user/${user.id}`} className="text-photo-secondary hover:text-photo-indigo transition-colors font-medium">
              {user.name}
            </Link>
            <p className="text-photo-secondary/60 text-xs">@{user.username}</p>
          </div>
          {!isOwner && (
            <Button variant="outline" size="sm" className="ml-auto">
              Follow
            </Button>
          )}
        </div>
      </div>
      
      {/* Photo info */}
      <div className="p-6 flex-1 overflow-y-auto">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-photo-secondary/70 text-xs mb-1">Title</label>
              <Input
                value={editedTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="bg-photo-darkgray/30 border-photo-border text-photo-secondary"
              />
            </div>
            
            <div>
              <label className="block text-photo-secondary/70 text-xs mb-1">Description</label>
              <Textarea
                value={editedDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="bg-photo-darkgray/30 border-photo-border text-photo-secondary min-h-[120px]"
                placeholder="Add a description..."
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={onCancelEdit}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="gap-1 bg-photo-indigo hover:bg-photo-indigo/90"
                onClick={onSaveEdit}
              >
                <Check className="h-4 w-4 mr-1" />
                Save changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-photo-secondary mb-2 break-words">
              {photo.title}
            </h1>
            
            {photo.description && (
              <p className="text-photo-secondary/80 text-sm mt-4 mb-6 break-words">
                {photo.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-photo-secondary/60 text-sm mt-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{photo.likes}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{photo.comments}</span>
                </div>
              </div>
            </div>
            
            {isOwner && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-6 gap-1"
                onClick={onStartEditing}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit details
              </Button>
            )}
          </>
        )}
      </div>
      
      {/* Album info */}
      <div className="p-6 border-t border-photo-border/20">
        <p className="text-photo-secondary/70 text-xs mb-2">From the album</p>
        <Link href={`/album/${album.id}`} className="text-photo-secondary hover:text-photo-indigo transition-colors">
          {album.title}
        </Link>
        
        {/* Mobile navigation */}
        <div className="flex items-center justify-between mt-4 md:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            disabled={!prevPhoto}
            onClick={onNavigatePrev}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            disabled={!nextPhoto}
            onClick={onNavigateNext}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}