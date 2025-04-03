// File path: /lib/services/users.ts

import { supabase, DbUser, UserStats } from '@/lib/supabase/client';
import { User } from '@clerk/nextjs/server';

// Sync a Clerk user to our Supabase users table
export async function syncUserToSupabase(clerkUser: User): Promise<DbUser | null> {
  if (!clerkUser.id || !clerkUser.emailAddresses[0]?.emailAddress) {
    console.error('Invalid Clerk user data');
    return null;
  }
  
  // Check if user already exists in Supabase
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkUser.id)
    .single();
    
  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'not found'
    console.error('Error fetching user:', fetchError);
    return null;
  }
  
  // Get primary email address
  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
  
  // Create or update the user
  if (existingUser) {
    // Update existing user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.username || 'User',
        email: primaryEmail,
        avatar_url: clerkUser.imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', clerkUser.id)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating user:', updateError);
      return null;
    }
    
    return updatedUser;
  } else {
    // Create new user
    // Generate username if not provided
    let username = clerkUser.username;
    if (!username) {
      username = primaryEmail.split('@')[0];
      
      // Check if username already exists
      const { data: usernameCheck } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
        
      if (usernameCheck) {
        // Add random numbers to make it unique
        username = `${username}${Math.floor(Math.random() * 10000)}`;
      }
    }
    
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        clerk_id: clerkUser.id,
        username: username,
        name: clerkUser.firstName && clerkUser.lastName 
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
}

// Get a user by their Clerk ID
export async function getUserByClerkId(clerkId: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();
    
  if (error) {
    console.error('Error fetching user by Clerk ID:', error);
    return null;
  }
  
  return data;
}

// Get a user by their Supabase ID
export async function getUserById(userId: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
  
  return data;
}

// Get a user by their username
export async function getUserByUsername(username: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
    
  if (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
  
  return data;
}

// Get user stats (album count, photo count, etc.)
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
  
  return data;
}

// Get all users (for user list page)
export async function getAllUsers(limit = 50, offset = 0): Promise<DbUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data || [];
}

// Update user profile
export async function updateUserProfile(
  userId: string, 
  updates: { username?: string; name?: string; avatar_url?: string | null }
): Promise<DbUser | null> {
  // Add updated_at timestamp
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('users')
    .update(updatesWithTimestamp)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
  
  return data;
}

// Check if a user is following another user
export async function checkIfFollowing(followerId: string, followingId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();
    
  if (error) {
    // Not found means not following
    return false;
  }
  
  return !!data;
}

// Follow a user
export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  // Don't allow following yourself
  if (followerId === followingId) {
    return false;
  }
  
  const { error } = await supabase
    .from('user_follows')
    .insert({
      follower_id: followerId,
      following_id: followingId
    });
    
  return !error;
}

// Unfollow a user
export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
    
  return !error;
}

// Get user's followers
export async function getUserFollowers(userId: string, limit = 50, offset = 0): Promise<DbUser[]> {
  const { data, error } = await supabase
    .from('user_follows')
    .select('users:follower_id(*)')
    .eq('following_id', userId)
    .range(offset, offset + limit - 1);
    
  if (error) {
    console.error('Error fetching user followers:', error);
    return [];
  }
  
  // Transform the data to get the users
  return data.map(item => item.users).flat() || [];
}

// Get users that a user is following
export async function getUserFollowing(userId: string, limit = 50, offset = 0): Promise<DbUser[]> {
  const { data, error } = await supabase
    .from('user_follows')
    .select('users:following_id(*)')
    .eq('follower_id', userId)
    .range(offset, offset + limit - 1);
    
  if (error) {
    console.error('Error fetching user following:', error);
    return [];
  }
  
  // Transform the data to get the users
  return data.map(item => item.users).flat() || [];
}