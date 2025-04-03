// File path: /app/api/albums/[id]/route.ts (continuation)

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { getAlbumById, updateAlbum, deleteAlbum } from '@/lib/services/albums';
import { getAlbumPhotos } from '@/lib/services/photos';

// GET /api/albums/[id] - Get a specific album and its photos
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    
    // Get the album
    const album = await getAlbumById(id);
    
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    // Check if the album is private and the user is not the owner
    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (album.is_private && album.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Get the album's photos
    const photos = await getAlbumPhotos(id);
    
    return NextResponse.json({ 
      album,
      photos
    });
  } catch (error) {
    console.error('Error in album GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/albums/[id] - Update an album
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    
    // Get the current user's Supabase ID
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get the request body
    const body = await req.json();
    const { title, description, is_private, cover_photo_id } = body;
    
    // Update the album
    const album = await updateAlbum(id, user.id, {
      title,
      description,
      is_private,
      cover_photo_id
    });
    
    if (!album) {
      return NextResponse.json({ error: 'Failed to update album or album not found' }, { status: 404 });
    }
    
    return NextResponse.json({ album });
  } catch (error) {
    console.error('Error in album PATCH route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/albums/[id] - Delete an album
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    
    // Get the current user's Supabase ID
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Delete the album
    const success = await deleteAlbum(id, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete album or album not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in album DELETE route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}