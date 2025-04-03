import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId, followUser, unfollowUser, checkIfFollowing } from '@/lib/services/users';

// POST /api/users/follow - Follow a user
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the request body
    const body = await req.json();
    const { targetUserId } = body;
    
    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }
    
    // Get the current user's Supabase ID
    const currentUser = await getUserByClerkId(clerkId);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }
    
    // Follow the target user
    const success = await followUser(currentUser.id, targetUserId);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in follow POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/users/follow - Unfollow a user
export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the request body
    const body = await req.json();
    const { targetUserId } = body;
    
    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }
    
    // Get the current user's Supabase ID
    const currentUser = await getUserByClerkId(clerkId);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }
    
    // Unfollow the target user
    const success = await unfollowUser(currentUser.id, targetUserId);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in unfollow DELETE route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/users/follow?userId=123 - Check if the current user is following another user
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const targetUserId = url.searchParams.get('userId');
    
    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }
    
    // Get the current user's Supabase ID
    const currentUser = await getUserByClerkId(clerkId);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }
    
    // Check if following
    const isFollowing = await checkIfFollowing(currentUser.id, targetUserId);
    
    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error('Error in follow GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}