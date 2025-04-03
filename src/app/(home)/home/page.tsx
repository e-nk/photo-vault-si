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
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, username, email, avatar_url');
          
        if (error) {
          console.error('Error fetching users:', error);
          setError(error.message);
          return;
        }
        
        // Map the data to match the expected format for UserCard component
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: user.full_name || 'Unknown User',
          username: user.username || 'user',
          email: user.email || '',
          avatar: user.avatar_url,
          albumCount: 0 // We'll update this later when albums are implemented
        }));
        
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Exception fetching users:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-photo-primary pb-16">
      <HomeHeader />

      <Container className="mt-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            Error loading users: {error}
          </div>
        )}

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