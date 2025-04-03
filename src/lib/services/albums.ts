// File path: /lib/services/albums.ts

import { supabase, DbAlbum } from '@/lib/supabase/client';

interface AlbumCreateData {
  title: string;
  description?: string;
  is_private?: boolean;
}

interface AlbumUpdateData {
  title?: string;
  description?: string | null;
  is_private?: boolean;
  cover_photo_id?: string | null;
}

// Get all albums for a user
export async function getUserAlbums(userId: string): Promise<DbAlbum[]> {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching user albums:', error);
    return [];
  }
  
  return data || [];
}

// Get all public albums from all users
export async function getPublicAlbums(limit = 20, offset = 0): Promise<(DbAlbum & { user: { name: string, username: string, avatar_url: string | null } })[]> {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      user:user_id (
        name,
        username,
        avatar_url
      )
    `)
    .eq('is_private', false)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (error) {
    console.error('Error fetching public albums:', error);
    return [];
  }
  
  return data || [];
}

// Get a specific album by ID
export async function getAlbumById(albumId: string): Promise<(DbAlbum & { user: { name: string, username: string, avatar_url: string | null } }) | null> {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      user:user_id (
        name,
        username,
        avatar_url
      )
    `)
    .eq('id', albumId)
    .single();
    
  if (error) {
    console.error('Error fetching album:', error);
    return null;
  }
  
  return data;
}

// Get all albums for the current logged-in user (my albums)
export async function getMyAlbums(userId: string): Promise<DbAlbum[]> {
  return getUserAlbums(userId);
}

// Create a new album
export async function createAlbum(userId: string, albumData: AlbumCreateData): Promise<DbAlbum | null> {
  const { data, error } = await supabase
    .from('albums')
    .insert({
      user_id: userId,
      title: albumData.title,
      description: albumData.description || null,
      is_private: albumData.is_private || false
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating album:', error);
    return null;
  }
  
  return data;
}

// Update an album
export async function updateAlbum(albumId: string, userId: string, updates: AlbumUpdateData): Promise<DbAlbum | null> {
  // Add updated_at timestamp
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Make sure the user can only update their own albums
  const { data, error } = await supabase
    .from('albums')
    .update(updatesWithTimestamp)
    .eq('id', albumId)
    .eq('user_id', userId)  // This ensures the user can only update their own albums
    .select()
    .single();
    
  if (error) {
    console.error('Error updating album:', error);
    return null;
  }
  
  return data;
}

// Delete an album
export async function deleteAlbum(albumId: string, userId: string): Promise<boolean> {
  // Make sure the user can only delete their own albums
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', albumId)
    .eq('user_id', userId);  // This ensures the user can only delete their own albums
    
  if (error) {
    console.error('Error deleting album:', error);
    return false;
  }
  
  return true;
}

// Check if an album is bookmarked by the user
export async function isAlbumBookmarked(albumId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('album_bookmarks')
    .select('id')
    .eq('album_id', albumId)
    .eq('user_id', userId)
    .single();
    
  if (error) {
    // Not found means not bookmarked
    return false;
  }
  
  return !!data;
}

// Bookmark an album
export async function bookmarkAlbum(albumId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('album_bookmarks')
    .insert({
      album_id: albumId,
      user_id: userId
    });
    
  return !error;
}

// Remove album bookmark
export async function unbookmarkAlbum(albumId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('album_bookmarks')
    .delete()
    .eq('album_id', albumId)
    .eq('user_id', userId);
    
  return !error;
}

// Get user's bookmarked albums
export async function getBookmarkedAlbums(userId: string): Promise<(DbAlbum & { user: { name: string, username: string, avatar_url: string | null } })[]> {
  const { data, error } = await supabase
    .from('album_bookmarks')
    .select(`
      album:album_id (
        *,
        user:user_id (
          name,
          username,
          avatar_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching bookmarked albums:', error);
    return [];
  }
  
  // Transform the data to get just the albums
  return data.map(item => item.album) || [];
}

// Search albums by title
export async function searchAlbums(query: string, limit = 20): Promise<(DbAlbum & { user: { name: string, username: string, avatar_url: string | null } })[]> {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      user:user_id (
        name,
        username,
        avatar_url
      )
    `)
    .eq('is_private', false)  // Only search public albums
    .ilike('title', `%${query}%`)
    .order('updated_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error searching albums:', error);
    return [];
  }
  
  return data || [];
}