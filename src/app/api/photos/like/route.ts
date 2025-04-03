import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { 
  likePhoto, 
  unlikePhoto, 
  isPhotoLiked, 
  getPhotoLikes 
} from '@/lib/services/photos';

// POST /api/photos/like - Like a photo
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
    
    // Like the photo
    const success = await likePhoto(photoId, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to like photo' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in like POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/photos/like - Unlike a photo
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
    
    // Unlike the photo
    const success = await unlikePhoto(photoId, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to unlike photo' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in unlike DELETE route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/photos/like?photoId=123 - Check if a photo is liked or get likes for a photo
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const photoId = url.searchParams.get('photoId');
    const getLikes = url.searchParams.get('getLikes') === 'true';
    
    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }
    
    // Get the current user's Supabase ID
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (getLikes) {
      // Get users who liked the photo
      const likes = await getPhotoLikes(photoId);
      return NextResponse.json({ likes });
    } else {
      // Check if the photo is liked by the user
      const isLiked = await isPhotoLiked(photoId, user.id);
      return NextResponse.json({ isLiked });
    }
  } catch (error) {
    console.error('Error in like GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
