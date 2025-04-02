"use client";

import React, { useState } from 'react';
import Container from '@/components/common/Container';
import { HomeHeader } from '@/components/home/HomeHeader';
import { UserSearch } from '@/components/home/UserSearch';
import { UserGrid } from '@/components/home/UserGrid';
import { dummyUsers } from '@/data/dummy-users';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = dummyUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-photo-primary pb-16">
      {/* Page header */}
      <HomeHeader />

      {/* Users section */}
      <Container className="mt-8">
        {/* Search */}
        <UserSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          resultsCount={filteredUsers.length}
        />

        {/* User grid */}
        <UserGrid users={filteredUsers} searchTerm={searchTerm} />
      </Container>
    </div>
  );
}