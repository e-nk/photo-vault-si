// File path: /lib/services/photos.ts

import { supabase, DbPhoto, PhotoStats } from '@/lib/supabase/client';

interface PhotoUploadData {
  title: string;
  description?: string;
  file: File;
  aspect_ratio?: number;
}

interface PhotoUpdateData {
  title?: string;
  description?: string | null;
}

// Get all photos in an album
export async function getAlbumPhotos(albumId: string): Promise<DbPhoto[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching album photos:', error);
    return [];
  }
  
  return data || [];
}

// Get a specific photo by ID
export async function getPhotoById(photoId: string): Promise<(DbPhoto & { album: { title: string }, user: { name: string, username: string, avatar_url: string | null } }) | null> {
  const { data, error } = await supabase
    .from('photos')
    .select(`
      *,
      album:album_id (
        title
      ),
      user:user_id (
        name,
        username,
        avatar_url
      )
    `)
    .eq('id', photoId)
    .single();
    
  if (error) {
    console.error('Error fetching photo:', error);
    return null;
  }
  
  return data;
}

// Get photo stats (likes, comments)
export async function getPhotoStats(photoId: string): Promise<PhotoStats | null> {
  const { data, error } = await supabase
    .from('photo_stats')
    .select('*')
    .eq('id', photoId)
    .single();
    
  if (error) {
    console.error('Error fetching photo stats:', error);
    return null;
  }
  
  return data;
}

// Upload a new photo to an album
export async function uploadPhoto(
  albumId: string, 
  userId: string, 
  photoData: PhotoUploadData
): Promise<DbPhoto | null> {
  try {
    // 1. Generate a unique file name
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const fileExt = photoData.file.name.split('.').pop();
    const filePath = `${userId}/${albumId}/${fileName}.${fileExt}`;
    
    // 2. Upload the file to Storage
    const { error: uploadError } = await supabase
      .storage
      .from('photos')
      .upload(filePath, photoData.file);
      
    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return null;
    }
    
    // 3. Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('photos')
      .getPublicUrl(filePath);
    
    // 4. Create thumbnail (in a real app, this might be a serverless function)
    // For now, we'll use the same image as the thumbnail
    const thumbnailUrl = publicUrl;
    
    // 5. Insert the photo record
    const { data, error } = await supabase
      .from('photos')
      .insert({
        album_id: albumId,
        user_id: userId,
        title: photoData.title,
        description: photoData.description || null,
        url: publicUrl,
        thumbnail_url: thumbnailUrl,
        storage_path: filePath,
        aspect_ratio: photoData.aspect_ratio || null
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error inserting photo record:', error);
      
      // Clean up the uploaded file
      await supabase
        .storage
        .from('photos')
        .remove([filePath]);
        
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in upload process:', error);
    return null;
  }
}

// Update photo details
export async function updatePhoto(
  photoId: string, 
  userId: string, 
  updates: PhotoUpdateData
): Promise<DbPhoto | null> {
  // Add updated_at timestamp
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Make sure the user can only update their own photos
  const { data, error } = await supabase
    .from('photos')
    .update(updatesWithTimestamp)
    .eq('id', photoId)
    .eq('user_id', userId)  // This ensures the user can only update their own photos
    .select()
    .single();
    
  if (error) {
    console.error('Error updating photo:', error);
    return null;
  }
  
  return data;
}

// Delete a photo
export async function deletePhoto(photoId: string, userId: string): Promise<boolean> {
  try {
    // 1. Get the photo to get the storage path
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('storage_path')
      .eq('id', photoId)
      .eq('user_id', userId)  // This ensures the user can only delete their own photos
      .single();
      
    if (fetchError) {
      console.error('Error fetching photo for deletion:', fetchError);
      return false;
    }
    
    // 2. Delete the photo record (this will trigger the photo_count update via trigger)
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId)
      .eq('user_id', userId);
      
    if (deleteError) {
      console.error('Error deleting photo record:', deleteError);
      return false;
    }
    
    // 3. Delete the file from storage
    if (photo && photo.storage_path) {
      const { error: storageError } = await supabase
        .storage
        .from('photos')
        .remove([photo.storage_path]);
        
      if (storageError) {
        console.error('Error deleting photo from storage:', storageError);
        // We don't return false here because the database record is already deleted
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletion process:', error);
    return false;
  }
}

// Batch upload multiple photos to an album
export async function batchUploadPhotos(
  albumId: string, 
  userId: string, 
  files: File[], 
  defaultTitle: string = "Untitled Photo"
): Promise<{
  success: boolean;
  uploaded: number;
  failed: number;
}> {
  let uploaded = 0;
  let failed = 0;
  
  for (const file of files) {
    // Try to determine the aspect ratio
    let aspectRatio = null;
    if (file.type.startsWith('image/')) {
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = () => {
            aspectRatio = img.width / img.height;
            URL.revokeObjectURL(img.src);
            resolve(null);
          };
        });
      } catch (error) {
        console.error('Error calculating aspect ratio:', error);
      }
    }
    
    // Upload the photo
    const result = await uploadPhoto(albumId, userId, {
      title: defaultTitle,
      file,
      aspect_ratio: aspectRatio
    });
    
    if (result) {
      uploaded++;
    } else {
      failed++;
    }
  }
  
  return {
    success: failed === 0,
    uploaded,
    failed
  };
}

// Like a photo
export async function likePhoto(photoId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('photo_likes')
    .insert({
      photo_id: photoId,
      user_id: userId
    });
    
  return !error;
}

// Unlike a photo
export async function unlikePhoto(photoId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('photo_likes')
    .delete()
    .eq('photo_id', photoId)
    .eq('user_id', userId);
    
  return !error;
}

// Check if a photo is liked by the user
export async function isPhotoLiked(photoId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('photo_likes')
    .select('id')
    .eq('photo_id', photoId)
    .eq('user_id', userId)
    .single();
    
  if (error) {
    // Not found means not liked
    return false;
  }
  
  return !!data;
}

// Get users who liked a photo
export async function getPhotoLikes(photoId: string, limit = 20): Promise<{ id: string; name: string; username: string; avatar_url: string | null }[]> {
  const { data, error } = await supabase
    .from('photo_likes')
    .select(`
      user:user_id (
        id,
        name,
        username,
        avatar_url
      )
    `)
    .eq('photo_id', photoId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching photo likes:', error);
    return [];
  }
  
  // Transform the data to get just the users
  return data.map(item => item.user) || [];
}

// Add a comment to a photo
export async function addPhotoComment(photoId: string, userId: string, content: string): Promise<{ id: string; created_at: string } | null> {
  const { data, error } = await supabase
    .from('photo_comments')
    .insert({
      photo_id: photoId,
      user_id: userId,
      content
    })
    .select('id, created_at')
    .single();
    
  if (error) {
    console.error('Error adding photo comment:', error);
    return null;
  }
  
  return data;
}

// Delete a comment
export async function deletePhotoComment(commentId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('photo_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);  // This ensures the user can only delete their own comments
    
  return !error;
}

// Get comments for a photo
export async function getPhotoComments(photoId: string, limit = 50): Promise<{
  id: string;
  content: string;
  created_at: string;
  user: { id: string; name: string; username: string; avatar_url: string | null };
}[]> {
  const { data, error } = await supabase
    .from('photo_comments')
    .select(`
      id,
      content,
      created_at,
      user:user_id (
        id,
        name,
        username,
        avatar_url
      )
    `)
    .eq('photo_id', photoId)
    .order('created_at', { ascending: true })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching photo comments:', error);
    return [];
  }
  
  return data || [];
}

// Bookmark a photo
export async function bookmarkPhoto(photoId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('photo_bookmarks')
    .insert({
      photo_id: photoId,
      user_id: userId
    });
    
  return !error;
}

// Remove photo bookmark
export async function unbookmarkPhoto(photoId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('photo_bookmarks')
    .delete()
    .eq('photo_id', photoId)
    .eq('user_id', userId);
    
  return !error;
}

// Check if a photo is bookmarked by the user
export async function isPhotoBookmarked(photoId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('photo_bookmarks')
    .select('id')
    .eq('photo_id', photoId)
    .eq('user_id', userId)
    .single();
    
  if (error) {
    // Not found means not bookmarked
    return false;
  }
  
  return !!data;
}

// Get user's bookmarked photos
export async function getBookmarkedPhotos(userId: string, limit = 50): Promise<(DbPhoto & { album: { title: string }, user: { name: string, username: string } })[]> {
  const { data, error } = await supabase
    .from('photo_bookmarks')
    .select(`
      photo:photo_id (
        *,
        album:album_id (
          title
        ),
        user:user_id (
          name,
          username
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching bookmarked photos:', error);
    return [];
  }
  
  // Transform the data to get just the photos
  return data.map(item => item.photo) || [];
}

// Search photos by title or description
export async function searchPhotos(query: string, limit = 20): Promise<(DbPhoto & { album: { title: string }, user: { name: string, username: string } })[]> {
  const { data, error } = await supabase
    .from('photos')
    .select(`
      *,
      album:album_id (
        title
      ),
      user:user_id (
        name,
        username
      )
    `)
    .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error searching photos:', error);
    return [];
  }
  
  return data || [];
}