import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Album, Users } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/data/dummy-users';

type UserCardProps = Omit<User, 'id'> & {
  id: number;
};

export const UserCard = ({
  id,
  name,
  username,
  email,
  albumCount,
  avatar
}: UserCardProps) => {
  return (
    <Link href={`/user/${id}`}>
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-photo-border bg-photo-darkgray/20 group hover:border-photo-indigo/30 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-b from-photo-indigo/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-12 w-12 border-2 border-photo-indigo/30">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-photo-indigo/20 text-photo-secondary">
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-photo-secondary truncate">{name}</h3>
              <p className="text-sm text-photo-secondary/60 truncate">@{username}</p>
            </div>
          </div>
          
          <p className="text-sm text-photo-secondary/70 truncate mb-2" title={email}>
            {email}
          </p>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 border-t border-photo-border/20 mt-2">
          <div className="flex items-center text-photo-secondary/60 text-sm">
            <Album size={16} className="mr-2" />
            <span>{albumCount} album{albumCount !== 1 ? 's' : ''}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};