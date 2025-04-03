import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { getMyAlbums } from '@/lib/services/albums';

// GET /api/albums/my - Get the current user's albums
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
    
    // Get the user's albums
    const albums = await getMyAlbums(user.id);
    
    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Error in my albums GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}