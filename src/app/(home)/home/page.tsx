// app/(home)/home/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/common/Container';
import { HomeHeader } from '@/components/home/HomeHeader';
import { UserSearch } from '@/components/home/UserSearch';
import { UserGrid } from '@/components/home/UserGrid';
import { supabase } from '@/lib/supabase/client';

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select('*');
        
      if (!error && data) {
        setUsers(data);
      }
      
      setIsLoading(false);
    }
    
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-photo-primary pb-16">
      <HomeHeader />

      <Container className="mt-8">
        <UserSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          resultsCount={filteredUsers.length}
        />

        <UserGrid 
          users={filteredUsers} 
          isLoading={isLoading} 
          searchTerm={searchTerm}
        />
      </Container>
    </div>
  );
}