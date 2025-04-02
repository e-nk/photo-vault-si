"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  resultsCount: number;
}

export const UserSearch = ({ 
  searchTerm, 
  setSearchTerm,
  resultsCount 
}: UserSearchProps) => {
  return (
    <div className="mb-8">
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-photo-secondary/50" size={18} />
        <Input
          placeholder="Search users by name, username or email..."
          className="pl-10 bg-photo-darkgray/30 border-photo-border text-photo-secondary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results count */}
      <p className="text-photo-secondary/60 text-sm">
        Showing {resultsCount} users
      </p>
    </div>
  );
};