"use client";

import React, { useState } from 'react';
import { Album } from '@/data/dummy-albums';
import { MyAlbum } from '@/data/my-albums';
import { User } from '@/data/dummy-users';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Upload, Edit, Trash2, MoreHorizontal, Lock, Globe, 
  Calendar, Image, Share2, Download, Heart
} from 'lucide-react';
import Container from '@/components/common/Container';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';

interface AlbumHeaderProps {
  album: Album | MyAlbum;
  user: User;
  totalPhotos: number;
  isOwner?: boolean;
  backUrl?: string;
  onUpdate?: (updates: Partial<MyAlbum>) => void;
  onDelete?: () => void;
  onUpload?: () => void;
}

export function AlbumHeader({ 
  album, 
  user, 
  totalPhotos,
  isOwner = false,
  backUrl = '/',
  onUpdate,
  onDelete,
  onUpload
}: AlbumHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(album.title);
  const [editedDescription, setEditedDescription] = useState(
    'description' in album ? album.description || '' : ''
  );
  const [editedPrivate, setEditedPrivate] = useState(
    'isPrivate' in album ? album.isPrivate : false
  );
  
  const formattedDate = formatDistanceToNow(
    new Date('dateUpdated' in album && album.dateUpdated 
      ? album.dateUpdated 
      : album.dateCreated
    ), 
    { addSuffix: true }
  );
  
  const isPrivate = 'isPrivate' in album ? album.isPrivate : false;
  
  const handleSaveEdit = () => {
    if (!editedTitle.trim() || !onUpdate) return;
    
    onUpdate({
      title: editedTitle.trim(),
      description: editedDescription.trim() || undefined,
      isPrivate: editedPrivate
    });
    
    setIsEditDialogOpen(false);
  };
  
  const handleConfirmDelete = () => {
    if (onDelete) onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="pt-8 pb-4 border-b border-photo-border/20 bg-gradient-to-b from-photo-darkgray/20 to-transparent">
        <Container>
          <div className="mb-6">
            <Link href={backUrl} className="inline-flex items-center text-photo-secondary/70 hover:text-photo-secondary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isOwner ? 'Back to My Albums' : `Back to ${user.name}'s profile`}
            </Link>
          </div>
        
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-photo-secondary">{album.title}</h1>
              {('isPrivate' in album) && (
                isPrivate ? (
                  <Badge variant="outline" className="gap-1 border-photo-border bg-photo-darkgray/30">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 border-photo-border bg-photo-darkgray/30">
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                )
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isOwner ? (
                // Owner actions
                <>
                  {onUpload && (
                    <Button 
                      variant="default" 
                      className="gap-1 bg-photo-indigo hover:bg-photo-indigo/90"
                      onClick={onUpload}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Add Photos
                    </Button>
                  )}
                  
                  {onUpdate && (
                    <Button 
                      variant="outline" 
                      className="gap-1"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </>
              ) : (
                // Viewer actions
                <>
                  <Button variant="outline" className="gap-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    Copy album link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download all photos
                  </DropdownMenuItem>
                  {isOwner && onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete album
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {('description' in album && album.description) && (
            <p className="text-photo-secondary/80 max-w-3xl mb-6">
              {album.description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
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
            </div>
            
            <div className="flex flex-wrap gap-4 gap-y-2 text-sm text-photo-secondary/60">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Updated {formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Image className="h-4 w-4 mr-1" />
                <span>{totalPhotos} photos</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Edit Album Dialog - Only shown for owner */}
      {isOwner && onUpdate && (
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
      )}
      
      {/* Delete Confirmation Dialog - Only shown for owner */}
      {isOwner && onDelete && (
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
                This will permanently delete the album and all of its contents ({totalPhotos} photos).
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
      )}
    </>
  );
}