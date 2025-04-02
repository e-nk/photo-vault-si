import React from 'react';
import { Album } from '@/data/dummy-albums';
import { User } from '@/data/dummy-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Heart, Share2, Download, Calendar, Image, ArrowLeft, 
  MoreHorizontal, Bookmark, Eye
} from 'lucide-react';
import Container from '@/components/common/Container';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AlbumHeaderProps {
  album: Album;
  user: User;
  totalPhotos: number;
}

export function AlbumHeader({ album, user, totalPhotos }: AlbumHeaderProps) {
  const formattedDate = formatDistanceToNow(new Date(album.dateCreated), { addSuffix: true });
  
  return (
    <div className="pt-8 pb-4 border-b border-photo-border/20">
      <Container>
        <div className="mb-6">
          <Link href={`/user/${user.id}`} className="inline-flex items-center text-photo-secondary/70 hover:text-photo-secondary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {user.name}'s profile
          </Link>
        </div>
      
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-photo-secondary">{album.title}</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Heart className="h-4 w-4 mr-1" />
              Like
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download album
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View slideshow
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  Report content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center border-t border-photo-border/10 pt-6">
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
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center text-photo-secondary/60">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Created {formattedDate}</span>
            </div>
            <div className="flex items-center text-photo-secondary/60">
              <Image className="h-4 w-4 mr-1" />
              <span>{totalPhotos} photos</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}