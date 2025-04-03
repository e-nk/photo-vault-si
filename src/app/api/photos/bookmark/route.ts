import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { 
  bookmarkPhoto, 
  unbookmarkPhoto, 
  isPhotoBookmarked, 
  getBookmarkedPhotos 
} from '@/lib/services/photos';

// POST /api/photos/bookmark - Bookmark a photo
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
    const { photoId } = body;
    
    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }
    
    // Bookmark the photo
    const success = await bookmarkPhoto(photoId, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to bookmark photo' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in bookmark POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/photos/bookmark - Remove photo bookmark
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
    const { photoId } = body;
    
    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }
    
    // Unbookmark the photo
    const success = await unbookmarkPhoto(photoId, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to remove photo bookmark' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in unbookmark DELETE route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/photos/bookmark - Get bookmarked photos or check if a photo is bookmarked
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
    const photoId = url.searchParams.get('photoId');
    
    if (photoId) {
      // Check if the photo is bookmarked
      const isBookmarked = await isPhotoBookmarked(photoId, user.id);
      return NextResponse.json({ isBookmarked });
    } else {
      // Get all bookmarked photos
      const photos = await getBookmarkedPhotos(user.id);
      return NextResponse.json({ photos });
    }
  } catch (error) {
    console.error('Error in bookmark GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}