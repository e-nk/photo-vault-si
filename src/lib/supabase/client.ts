import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Type definitions for our database tables
export type DbUser = {
  id: string;
  clerk_id: string;
  username: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DbAlbum = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_private: boolean;
  cover_photo_id: string | null;
  created_at: string;
  updated_at: string;
  photo_count: number;
};

export type DbPhoto = {
  id: string;
  album_id: string;
  user_id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string;
  storage_path: string;
  aspect_ratio: number | null;
  created_at: string;
  updated_at: string;
};

export type PhotoStats = {
  id: string;
  title: string;
  likes_count: number;
  comments_count: number;
};

export type UserStats = {
  id: string;
  name: string;
  username: string;
  album_count: number;
  photo_count: number;
  following_count: number;
  followers_count: number;
};

export type DbPhotoLike = {
  id: string;
  photo_id: string;
  user_id: string;
  created_at: string;
};

export type DbPhotoComment = {
  id: string;
  photo_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type DbUserFollow = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};

export type DbAlbumBookmark = {
  id: string;
  album_id: string;
  user_id: string;
  created_at: string;
};

export type DbPhotoBookmark = {
  id: string;
  photo_id: string;
  user_id: string;
  created_at: string;
};