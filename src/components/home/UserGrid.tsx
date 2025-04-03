// components/home/UserGrid.tsx
import React from 'react';
import { UserCard } from '@/components/home/UserCard';

interface User {
  id: string | number;
  name?: string;
  username?: string;
  email?: string;
  albumCount?: number;
  avatar?: string;
}

interface UserGridProps {
  users: User[];
  isLoading?: boolean;
  searchTerm: string;
}

export const UserGrid = ({ users, isLoading = false, searchTerm }: UserGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="h-40 bg-photo-darkgray/10 rounded-lg animate-pulse border border-photo-border/20"
          />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-photo-secondary/60">
          {searchTerm ? `No users found matching "${searchTerm}"` : "No users found"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.map(user => (
        <UserCard
          key={user.id}
          id={user.id}
          name={user.name}
          username={user.username}
          email={user.email}
          albumCount={user.albumCount}
          avatar={user.avatar}
        />
      ))}
    </div>
  );
};