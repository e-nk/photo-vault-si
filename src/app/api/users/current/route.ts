// app/api/users/current/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();    
    // Ensure user is authenticated
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user from Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();
    
    if (error) {
      console.log('User not found in Supabase, trying to sync from Clerk');
      
      // If user doesn't exist in Supabase yet, try to sync
      const clerkUser = await currentUser();
      if (clerkUser) {
        const syncedUser = await syncUserToSupabase(clerkUser);
        if (syncedUser) {
          return NextResponse.json({ user: syncedUser });
        }
      }
      return NextResponse.json({ error: 'User not found in Supabase' }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in current user GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to sync a user from Clerk to Supabase
async function syncUserToSupabase(clerkUser) {
  if (!clerkUser.id || !clerkUser.emailAddresses[0]?.emailAddress) {
    console.error('Invalid Clerk user data');
    return null;
  }
  
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get primary email address
  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
  
  // Generate username if not provided
  let username = clerkUser.username;
  if (!username) {
    // Take the part before @ and remove any characters that don't match the format constraint
    username = primaryEmail.split('@')[0].replace(/[^a-zA-Z0-9_\.]/g, '');
    
    // Ensure username is not empty after sanitization
    if (!username) {
      username = 'user';
    }
    
    // Check if username already exists
    try {
      const { data: usernameCheck } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
        
      if (usernameCheck) {
        // Add random numbers to make it unique
        username = `${username}${Math.floor(Math.random() * 10000)}`;
      }
    } catch (err) {
      // Ignore - probably means the username is available
    }
  }
  
  // Ensure username meets length requirement (3-30 characters)
  if (username.length < 3) {
    username = username.padEnd(3, '0');
  } else if (username.length > 30) {
    username = username.substring(0, 30);
  }
  
  // Create new user
  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({
      clerk_id: clerkUser.id,
      username: username,
      full_name: clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.username || 'User',
      email: primaryEmail,
      avatar_url: clerkUser.imageUrl
    })
    .select()
    .single();
    
  if (createError) {
    console.error('Error creating user:', createError);
    return null;
  }
  
  return newUser;
}