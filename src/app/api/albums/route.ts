import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { getPublicAlbums, createAlbum } from '@/lib/services/albums';

// GET /api/albums - Get all public albums
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Get all public albums
    const albums = await getPublicAlbums(limit, offset);
    
    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Error in albums GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/albums - Create a new album
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
    const { title, description, is_private } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Album title is required' }, { status: 400 });
    }
    
    // Create the album
    const album = await createAlbum(user.id, {
      title,
      description,
      is_private
    });
    
    if (!album) {
      return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
    }
    
    return NextResponse.json({ album });
  } catch (error) {
    console.error('Error in albums POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}