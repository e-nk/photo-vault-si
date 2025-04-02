"use client";

import React, { useState } from 'react';
import { MyAlbum } from '@/data/my-albums';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { 
  Calendar, Image, Lock, MoreHorizontal, Edit, Trash2, PlusSquare, Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';

interface MyAlbumCardProps {
  album: MyAlbum;
  onUpdate: (albumId: number, updates: Partial<MyAlbum>) => void;
  onDelete: (albumId: number) => void;
  onAddPhotos: (albumId: number) => void;
}

export function MyAlbumCard({ album, onUpdate, onDelete, onAddPhotos }: MyAlbumCardProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(album.title);
  const [editedDescription, setEditedDescription] = useState(album.description || '');
  const [editedPrivate, setEditedPrivate] = useState(album.isPrivate);
  
  const formattedDate = formatDistanceToNow(new Date(album.dateUpdated || album.dateCreated), { addSuffix: true });
  
  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onUpdate(album.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim() || undefined,
        isPrivate: editedPrivate
      });
      setIsEditDialogOpen(false);
    }
  };
  
  const handleConfirmDelete = () => {
    onDelete(album.id);
    setIsDeleteDialogOpen(false);
  };
  
  const navigateToAlbum = () => {
    router.push(`/album/${album.id}`);
  };

  return (
    <>
      <Card className="overflow-hidden group bg-photo-darkgray/20 border-photo-border hover:shadow-lg hover:shadow-photo-indigo/5 hover:border-photo-border/50 transition-all duration-300">
        {/* Album Cover */}
        <div 
          className="aspect-ratio-container cursor-pointer relative overflow-hidden"
          onClick={navigateToAlbum}
        >
          <div className="pb-[65%] relative">
            <img 
              src={album.coverImage} 
              alt={album.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Privacy badge */}
          {album.isPrivate && (
            <Badge variant="secondary" className="absolute top-3 left-3 bg-black/60 text-white border-0 gap-1 backdrop-blur-sm">
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Badge>
          )}
          
          {/* Action buttons that appear on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
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
                  onAddPhotos(album.id);
                }}
              >
                <PlusSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-medium text-photo-secondary truncate mb-1 cursor-pointer"
                onClick={navigateToAlbum}
              >
                {album.title}
              </h3>
              
              {album.description && (
                <p className="text-photo-secondary/60 text-xs line-clamp-2 mb-2">
                  {album.description}
                </p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/my-albums/${album.id}`)}>
                  <Image className="h-4 w-4 mr-2" />
                  View album
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddPhotos(album.id)}>
                  <PlusSquare className="h-4 w-4 mr-2" />
                  Add photos
                </DropdownMenuItem>
                {!album.isPrivate && (
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share album
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center text-xs text-photo-secondary/50">
          <div className="flex items-center mr-4">
            <Image className="h-3 w-3 mr-1" />
            <span>{album.photoCount} photos</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Updated {formattedDate}</span>
          </div>
        </CardFooter>
      </Card>
      
      {/* Edit Album Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-photo-primary border-photo-border text-photo-secondary">
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
            <DialogDescription className="text-photo-secondary/70">
              Make changes to your album details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-album-title">Album Title</Label>
              <Input
                id="edit-album-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-photo-darkgray/30 border-photo-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-album-description">Description (optional)</Label>
              <Textarea
                id="edit-album-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="bg-photo-darkgray/30 border-photo-border"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-private-mode"
                checked={editedPrivate}
                onCheckedChange={setEditedPrivate}
              />
              <Label htmlFor="edit-private-mode">Private Album</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-photo-indigo hover:bg-photo-indigo/90"
              onClick={handleSaveEdit}
              disabled={!editedTitle.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-photo-primary border-photo-border text-photo-secondary">
          <DialogHeader>
            <DialogTitle>Delete Album</DialogTitle>
            <DialogDescription className="text-photo-secondary/70">
              Are you sure you want to delete this album? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-photo-secondary">
              Album: <span className="font-medium">{album.title}</span>
            </p>
            <p className="text-photo-secondary/70 text-sm mt-2">
              This will permanently delete the album and all of its contents.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete Album
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}