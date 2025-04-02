
import React from 'react';
import { UserCard } from '@/components/home/UserCard';
import { User } from '@/data/dummy-users';

interface UserGridProps {
  users: User[];
  searchTerm: string;
}

export const UserGrid = ({ users, searchTerm }: UserGridProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-photo-secondary/60">No users found matching "{searchTerm}"</p>
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