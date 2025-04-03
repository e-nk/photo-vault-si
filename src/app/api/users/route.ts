// app/api/users/route.ts - improved POST handler with better error logging
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// POST /api/users - Sync current user to Supabase
export async function POST(req: NextRequest) {
  try {
    // Get the current user from Clerk
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log("Current Clerk user:", user.id, user.firstName, user.lastName);
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user already exists
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is 'not found'
        console.error('Error checking for existing user:', checkError);
        return NextResponse.json({ error: `Error checking for existing user: ${checkError.message}` }, { status: 500 });
      }
      
      if (existingUser) {
        console.log("User already exists in Supabase:", existingUser);
        return NextResponse.json({ user: existingUser, message: 'User already exists' });
      }
    } catch (checkErr) {
      console.error('Exception checking for existing user:', checkErr);
      return NextResponse.json({ error: `Exception checking for existing user: ${checkErr.message}` }, { status: 500 });
    }
    
    // If not, create the user
    const primaryEmail = user.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) {
      return NextResponse.json({ error: 'User has no email address' }, { status: 400 });
    }
    
    console.log("Creating new user with email:", primaryEmail);
    
    // Generate username if not provided, ensuring it matches the required format
    let username = user.username;
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
          console.log("Generated unique username:", username);
        }
      } catch (usernameErr) {
        // Ignore - just means username doesn't exist
        console.log("Username check error (probably just means it's unique):", usernameErr);
      }
    }
    
    // Ensure username meets length requirement (3-30 characters)
    if (username.length < 3) {
      username = username.padEnd(3, '0');
    } else if (username.length > 30) {
      username = username.substring(0, 30);
    }
    
    // Prepare user data
    const userData = {
      clerk_id: user.id,
      username: username,
      full_name: user.firstName && user.lastName ? 
        `${user.firstName} ${user.lastName}`.trim() : 
        (user.username || 'User'),
      email: primaryEmail,
      avatar_url: user.imageUrl
    };
    
    console.log("Inserting user data:", userData);
    
    // Create the user in Supabase
    try {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating user in Supabase:', insertError);
        return NextResponse.json({ 
          error: `Failed to create user: ${insertError.message}`,
          details: insertError
        }, { status: 500 });
      }
      
      console.log("User successfully created:", newUser);
      return NextResponse.json({ user: newUser, message: 'User created' });
    } catch (insertErr) {
      console.error('Exception creating user:', insertErr);
      return NextResponse.json({ 
        error: `Exception creating user: ${insertErr.message}`,
        details: insertErr
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Top-level error in users POST route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}