// lib/api.ts

import { supabase } from '@/lib/supabase/client';

// User API Methods
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', user.id)
    .single();
    
  return data;
}

// Albums API Methods
export async function getMyAlbums() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data } = await supabase
    .from('albums')
    .select(`
      *,
      users:user_id (*)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
    
  return data || [];
}

export async function createAlbum(title, description = null, isPrivate = false) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('albums')
    .insert({
      title,
      description,
      is_private: isPrivate,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getAlbumById(albumId) {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      users:user_id (*)
    `)
    .eq('id', albumId)
    .single();
    
  if (error) throw error;
  return data;
}

// Photos API Methods
export async function getPhotosByAlbumId(albumId) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function uploadPhoto(file, albumId, title = 'Untitled', description = null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // Upload the file
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath);
    
  // Create the photo record
  const { data, error } = await supabase
    .from('photos')
    .insert({
      title,
      description,
      url: publicUrl,
      thumbnail_url: publicUrl, // Ideally you'd create a thumbnail
      album_id: albumId,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}