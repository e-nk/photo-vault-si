"use client";

import React, { useState } from 'react';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus, Upload, Filter, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface MyAlbumsHeaderProps {
  albumCount: number;
  searchTerm: string;
  sortOption: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onCreateAlbum: (title: string, description: string, isPrivate: boolean) => void;
}

export function MyAlbumsHeader({
  albumCount,
  searchTerm,
  sortOption,
  onSearchChange,
  onSortChange,
  onCreateAlbum
}: MyAlbumsHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreateAlbum = () => {
    if (newAlbumTitle.trim()) {
      onCreateAlbum(newAlbumTitle.trim(), newAlbumDescription.trim(), isPrivate);
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewAlbumTitle('');
    setNewAlbumDescription('');
    setIsPrivate(false);
  };

  return (
    <div className="py-8 border-b border-photo-border/20">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-photo-secondary">My Albums</h1>
          
          <div className="flex flex-wrap gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1 bg-photo-indigo hover:bg-photo-indigo/90">
                  <Plus className="h-4 w-4 mr-1" />
                  Create Album
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-photo-primary border-photo-border text-photo-secondary">
                <DialogHeader>
                  <DialogTitle>Create New Album</DialogTitle>
                  <DialogDescription className="text-photo-secondary/70">
                    Add a new album to organize your photos.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="album-title">Album Title</Label>
                    <Input
                      id="album-title"
                      placeholder="Enter album title"
                      value={newAlbumTitle}
                      onChange={(e) => setNewAlbumTitle(e.target.value)}
                      className="bg-photo-darkgray/30 border-photo-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="album-description">Description (optional)</Label>
                    <Textarea
                      id="album-description"
                      placeholder="Enter album description"
                      value={newAlbumDescription}
                      onChange={(e) => setNewAlbumDescription(e.target.value)}
                      className="bg-photo-darkgray/30 border-photo-border"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="private-mode"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                    <Label htmlFor="private-mode">Private Album</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-photo-indigo hover:bg-photo-indigo/90"
                    onClick={handleCreateAlbum}
                    disabled={!newAlbumTitle.trim()}
                  >
                    Create Album
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="gap-1">
              <Upload className="h-4 w-4 mr-1" />
              Upload Photos
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-photo-secondary/50 h-4 w-4" />
            <Input
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-photo-darkgray/30 border-photo-border text-photo-secondary"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-photo-secondary/60 text-sm">
              {albumCount} album{albumCount !== 1 ? 's' : ''}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 ml-2">
                  <SortDesc className="h-4 w-4 mr-1" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={sortOption} onValueChange={onSortChange}>
                  <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="a-z">A to Z</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="z-a">Z to A</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="most-photos">Most Photos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="recently-updated">Recently Updated</DropdownMenuRadioItem>
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
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem value="all">All Albums</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="private">Private Only</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="public">Public Only</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Container>
    </div>
  );
}