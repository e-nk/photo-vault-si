// File path: /app/api/albums/bookmarks/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET all bookmarked albums for the current user
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get all bookmarked albums with album details
    const { data, error } = await supabase
      .from('album_bookmarks')
      .select(`
        id,
        created_at,
        albums:album_id (
          id,
          title,
          description,
          is_private,
          cover_photo_url,
          created_at,
          updated_at,
          photo_count,
          user_id,
          users:user_id (
            id,
            full_name,
            username,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error getting album bookmarks:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST to bookmark an album
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get album ID from request body
    const { albumId } = await req.json();
    
    if (!albumId) {
      return NextResponse.json({ error: 'Album ID is required' }, { status: 400 });
    }
    
    // Check if album exists and is accessible to the user
    const { data: albumData, error: albumError } = await supabase
      .from('albums')
      .select('id, is_private, user_id')
      .eq('id', albumId)
      .single();
    
    if (albumError || !albumData) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    // If album is private and user is not the owner, deny access
    if (albumData.is_private && albumData.user_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Check if bookmark already exists
    const { data: existingBookmark } = await supabase
      .from('album_bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('album_id', albumId)
      .single();
    
    if (existingBookmark) {
      return NextResponse.json({ message: 'Album already bookmarked' }, { status: 200 });
    }
    
    // Create bookmark
    const { data, error } = await supabase
      .from('album_bookmarks')
      .insert([
        { user_id: userId, album_id: albumId }
      ])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data, message: 'Album bookmarked successfully' });
  } catch (error) {
    console.error('Error bookmarking album:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// DELETE to remove a bookmark
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get album ID from URL parameters
    const url = new URL(req.url);
    const albumId = url.searchParams.get('albumId');
    
    if (!albumId) {
      return NextResponse.json({ error: 'Album ID is required' }, { status: 400 });
    }
    
    // Delete bookmark
    const { error } = await supabase
      .from('album_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('album_id', albumId);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Album bookmark removed successfully' });
  } catch (error) {
    console.error('Error removing album bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}