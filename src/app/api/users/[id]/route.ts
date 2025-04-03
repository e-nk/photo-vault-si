import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserById, getUserStats } from '@/lib/services/users';
import { getUserAlbums } from '@/lib/services/albums';

// GET /api/users/[id] - Get a user's profile and stats
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    // Ensure user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    
    // Get user profile
    const user = await getUserById(id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get user stats
    const stats = await getUserStats(id);
    
    // Get user's public albums
    const albums = await getUserAlbums(id);
    
    // Filter to only public albums if not the current user
    const visibleAlbums = userId === id 
      ? albums 
      : albums.filter(album => !album.is_private);
    
    return NextResponse.json({ 
      user,
      stats,
      albums: visibleAlbums
    });
  } catch (error) {
    console.error('Error in user GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}