import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, syncUserToSupabase, getAllUsers } from '@/lib/services/users';

// GET /api/users - Get all users
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    
    // Ensure user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Get all users
    const users = await getAllUsers(limit, offset);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in users GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/users - Sync current user to Supabase (usually called after login)
export async function POST(req: NextRequest) {
  try {
    // Get the current user from Clerk
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Sync user to Supabase
    const dbUser = await syncUserToSupabase(user);
    
    if (!dbUser) {
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
    }
    
    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error('Error in users POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}