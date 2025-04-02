"use client";

import React from 'react';
import { Album } from '@/data/dummy-albums';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Image } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const formattedDate = formatDistanceToNow(new Date(album.dateCreated), { addSuffix: true });
  
  return (
    <Link href={`/album/${album.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] group bg-photo-darkgray/20 border-photo-border hover:shadow-lg hover:shadow-photo-indigo/5 hover:border-photo-border/50">
        <div className="aspect-[4/3] relative overflow-hidden w-full">
          <img 
            src={album.coverImage} 
            alt={album.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium text-photo-secondary truncate mb-1 group-hover:text-photo-indigo transition-colors">
            {album.title}
          </h3>
          
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center text-photo-secondary/60 text-xs">
              <Image className="h-3 w-3 mr-1" />
              <span>{album.photoCount} photos</span>
            </div>
            
            <div className="flex items-center text-photo-secondary/60 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}