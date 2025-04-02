"use client";

import React, { useState } from 'react';
import { Photo } from '@/data/dummy-photos';
import { PhotoCard } from '@/components/shared/PhotoCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Grid, Rows, Columns, LayoutGrid, Search, SortDesc, Filter,
  Check, Trash2, SquareSlash, Upload
} from 'lucide-react';
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
} from "@/components/ui/dialog";

type GridLayout = 'masonry' | 'uniform' | 'rows' | 'columns';
type SortOption = 'newest' | 'oldest' | 'most-liked' | 'title-az' | 'title-za';

interface PhotoGridProps {
  photos: Photo[];
  isLoading?: boolean;
  isOwner?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onPhotoDelete?: (photoId: number) => void;
  onMultiDelete?: (photoIds: number[]) => void;
  onUploadClick?: () => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
}

export function PhotoGrid({ 
  photos,
  isLoading = false,
  isOwner = false,
  searchTerm = '',
  onSearchChange,
  onPhotoDelete,
  onMultiDelete,
  onUploadClick,
  emptyMessage = "No photos found",
  emptyActionLabel = "Upload Photos"
}: PhotoGridProps) {
  // Local state if not controlled externally
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedLayout, setSelectedLayout] = useState<GridLayout>('masonry');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Determine if we're using controlled or uncontrolled search
  const effectiveSearchTerm = onSearchChange ? searchTerm : localSearchTerm;
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearchTerm(value);
    }
  };
  
  // Toggle selection mode
  const selectionMode = selectedPhotos.length > 0;
  
  // Filter and sort photos
  const filteredPhotos = photos.filter(photo => 
    photo.title.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    (photo.description?.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ?? false)
  );
  
  // Sort photos
  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime();
      case 'oldest':
        return new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime();
      case 'most-liked':
        return b.likes - a.likes;
      case 'title-az':
        return a.title.localeCompare(b.title);
      case 'title-za':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  const handleToggleSelect = (photoId: number) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      // If all are selected, deselect all
      setSelectedPhotos([]);
    } else {
      // Otherwise, select all
      setSelectedPhotos(filteredPhotos.map(photo => photo.id));
    }
  };
  
  const handleConfirmDelete = () => {
    if (onMultiDelete && selectedPhotos.length > 0) {
      onMultiDelete(selectedPhotos);
      setSelectedPhotos([]);
    }
    setIsDeleteDialogOpen(false);
  };
  
  // Get grid class based on selected layout
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
  
  // Determine if all photos are selected
  const allSelected = filteredPhotos.length > 0 && selectedPhotos.length === filteredPhotos.length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="bg-photo-darkgray/10 rounded-lg border border-photo-border/20 animate-pulse"
            style={{ height: `${Math.floor(Math.random() * 100) + 200}px` }} 
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-photo-secondary/50 h-4 w-4" />
          <Input
            placeholder="Search photos..."
            value={effectiveSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-photo-darkgray/30 border-photo-border text-photo-secondary"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {selectionMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleSelectAll}
              >
                {allSelected ? (
                  <>
                    <SquareSlash className="h-4 w-4 mr-1" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Select All ({filteredPhotos.length})
                  </>
                )}
              </Button>
              
              {isOwner && onMultiDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected ({selectedPhotos.length})
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPhotos([])}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <SortDesc className="h-4 w-4 mr-1" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                    <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="most-liked">Most liked</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="title-az">Title (A-Z)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="title-za">Title (Z-A)</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {isOwner && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={handleSelectAll}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Select
                  </Button>
                  
                  {onUploadClick && (
                    <Button 
                      className="gap-1 bg-photo-indigo hover:bg-photo-indigo/90"
                      size="sm"
                      onClick={onUploadClick}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Results summary */}
      <div className="text-photo-secondary/60 text-sm mb-6">
        {effectiveSearchTerm ? (
          <p>Showing {filteredPhotos.length} photos matching "{effectiveSearchTerm}"</p>
        ) : (
          <p>Showing {filteredPhotos.length} photos</p>
        )}
      </div>
      
      {/* Photos Grid or Empty State */}
      {filteredPhotos.length === 0 ? (
        <div className="py-16 text-center">
          <h3 className="text-photo-secondary/60 text-lg mb-2">{emptyMessage}</h3>
          {isOwner && onUploadClick && (
            <>
              <p className="text-photo-secondary/50 text-sm mb-6">Upload some photos to get started.</p>
              <Button 
                className="bg-photo-indigo hover:bg-photo-indigo/90"
                onClick={onUploadClick}
              >
                {emptyActionLabel}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className={getGridClass()}>
          {sortedPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              layout={selectedLayout}
              isOwner={isOwner}
              isSelectable={isOwner}
              isSelected={selectedPhotos.includes(photo.id)}
              onToggleSelect={() => handleToggleSelect(photo.id)}
            />
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      {isOwner && onMultiDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-photo-primary border-photo-border text-photo-secondary">
            <DialogHeader>
              <DialogTitle>Delete Photos</DialogTitle>
              <DialogDescription className="text-photo-secondary/70">
                Are you sure you want to delete the selected photos? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-photo-secondary">
                <span className="font-medium">{selectedPhotos.length}</span> photos will be permanently deleted.
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
                Delete Photos
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}