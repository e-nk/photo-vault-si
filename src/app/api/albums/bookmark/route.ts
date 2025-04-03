import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { 
  bookmarkAlbum, 
  unbookmarkAlbum, 
  isAlbumBookmarked, 
  getBookmarkedAlbums 
} from '@/lib/services/albums';

// POST /api/albums/bookmark - Bookmark an album
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the current user's Supabase ID
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get the request body
    const body = await req.json();
    const { albumId } = body;
    
    if (!albumId) {
      return NextResponse.json({ error: 'Album ID is required' }, { status: 400 });
    }
    
    // Bookmark the album
    const success = await bookmarkAlbum(albumId, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to bookmark album' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in bookmark POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/albums/bookmark - Remove album bookmark
export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the current user's Supabase ID
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get the request body
    const body = await req.json();
    const { albumId } = body;
    
    if (!albumId) {
      return NextResponse.json({ error: 'Album ID is required' }, { status: 400 });
    }
    
    // Unbookmark the album
    const success = await unbookmarkAlbum(albumId, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to remove album bookmark' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in unbookmark DELETE route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/albums/bookmark - Get bookmarked albums or check if an album is bookmarked
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the current user's Supabase ID
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const albumId = url.searchParams.get('albumId');
    
    // If albumId is provided, check if it's bookmarked
    if (albumId) {
      const isBookmarked = await isAlbumBookmarked(albumId, user.id);
      return NextResponse.json({ isBookmarked });
    }
    
    // Otherwise, get all bookmarked albums
    const albums = await getBookmarkedAlbums(user.id);
    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Error in bookmark GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}