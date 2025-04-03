// File path: /app/api/photos/comments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { addPhotoComment, deletePhotoComment, getPhotoComments } from '@/lib/services/photos';

// GET /api/photos/comments?photoId=123 - Get comments for a photo
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
    
    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }
    
    // Get comments for the photo
    const comments = await getPhotoComments(photoId);
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error in comments GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/photos/comments - Add a comment to a photo
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
    const { photoId, content } = body;
    
    if (!photoId || !content) {
      return NextResponse.json({ error: 'Photo ID and content are required' }, { status: 400 });
    }
    
    // Add the comment
    const comment = await addPhotoComment(photoId, user.id, content);
    
    if (!comment) {
      return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      comment: {
        id: comment.id,
        content,
        created_at: comment.created_at,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url
        }
      }
    });
  } catch (error) {
    console.error('Error in comments POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/photos/comments?id=123 - Delete a comment
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
    
    // Parse query parameters
    const url = new URL(req.url);
    const commentId = url.searchParams.get('id');
    
    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }
    
    // Delete the comment
    const success = await deletePhotoComment(commentId, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete comment or comment not found' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in comments DELETE route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}