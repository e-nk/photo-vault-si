import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/data/dummy-users';
import { Mail, Share2, UserPlus } from 'lucide-react';
import Container from '@/components/common/Container';

interface UserProfileHeaderProps {
  user: User;
  albumCount: number;
  totalPhotos: number;
}

export function UserProfileHeader({ user, albumCount, totalPhotos }: UserProfileHeaderProps) {
  return (
    <div className="pb-6 pt-10 border-b border-photo-border/20">
      <Container>
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* User Avatar */}
          <div className="relative group">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-photo-indigo/30">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-photo-indigo/20 text-photo-secondary text-2xl">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-photo-secondary mb-1">{user.name}</h1>
                <p className="text-photo-secondary/60 mb-1">@{user.username}</p>
                <p className="text-photo-secondary/70 text-sm">{user.email}</p>
              </div>
              <div className="md:ml-auto flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Mail className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button variant="default" size="sm" className="gap-1 bg-photo-indigo hover:bg-photo-indigo/90">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Follow
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-photo-secondary">{albumCount}</p>
                <p className="text-photo-secondary/60 text-sm">Albums</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-photo-secondary">{totalPhotos}</p>
                <p className="text-photo-secondary/60 text-sm">Photos</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-photo-secondary">245</p>
                <p className="text-photo-secondary/60 text-sm">Following</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-photo-secondary">1.2K</p>
                <p className="text-photo-secondary/60 text-sm">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}