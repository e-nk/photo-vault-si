import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';

// GET /api/users/current - Get the current user's Supabase ID
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user from Supabase
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      // If user doesn't exist in Supabase yet, try to sync
      const clerkUser = await currentUser();
      if (clerkUser) {
        const syncedUser = await syncUserToSupabase(clerkUser);
        if (syncedUser) {
          return NextResponse.json({ user: syncedUser });
        }
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in current user GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}