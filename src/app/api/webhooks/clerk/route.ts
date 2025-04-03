// File path: /app/api/webhooks/clerk/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  // Verify the webhook signature
  const headerPayload = headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');
  
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('Missing svix headers');
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }
  
  // Get the webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    );
  }
  
  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(webhookSecret);
  
  let evt: WebhookEvent;
  
  try {
    // Verify the webhook payload with the headers
    const payload = await req.text();
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }
  
  // Get the ID and type of the webhook event
  const eventType = evt.type;
  
  console.log(`Webhook received: ${eventType}`);
  console.log('Webhook payload:', JSON.stringify(evt.data, null, 2));
  
  // Initialize Supabase admin client (with service role key)
  const supabase = createRouteHandlerClient({ cookies }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  
  // Handle different webhook events
  try {
    // Fix the username generation in the webhook handler
if (eventType === 'user.created') {
  // A new user is created on Clerk
  const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
  
  const primaryEmail = email_addresses?.[0]?.email_address;
  
  if (!primaryEmail) {
    console.error('User created without email address');
    return NextResponse.json(
      { error: 'Invalid user data' },
      { status: 400 }
    );
  }
  
  // Check if user already exists in Supabase
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', id)
    .single();
  
  if (existingUser) {
    console.log(`User ${id} already exists in Supabase`);
    return NextResponse.json({ message: 'User already exists' });
  }
  
  // Generate valid username
  let validUsername = username;
  if (!validUsername) {
    // Take the part before @ and remove any characters that don't match the format constraint
    validUsername = primaryEmail.split('@')[0].replace(/[^a-zA-Z0-9_\.]/g, '');
    
    // Ensure username is not empty after sanitization
    if (!validUsername) {
      validUsername = 'user';
    }
  }
  
  // Ensure username meets length requirement (3-30 characters)
  if (validUsername.length < 3) {
    validUsername = validUsername.padEnd(3, '0');
  } else if (validUsername.length > 30) {
    validUsername = validUsername.substring(0, 30);
  }
  
  // Create user in Supabase
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        clerk_id: id,
        email: primaryEmail,
        username: validUsername,
        full_name: `${first_name || ''} ${last_name || ''}`.trim(),
        avatar_url: image_url,
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user in Supabase:', error);
    return NextResponse.json(
      { error: 'Error creating user', details: error },
      { status: 500 }
    );
  }
  
  console.log(`User ${id} created in Supabase:`, data);
  return NextResponse.json({ message: 'User created', data });
}
    
    else if (eventType === 'user.updated') {
      // User data is updated on Clerk
      const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
      
      const primaryEmail = email_addresses?.[0]?.email_address;
      
      if (!primaryEmail) {
        console.error('User updated without email address');
        return NextResponse.json(
          { error: 'Invalid user data' },
          { status: 400 }
        );
      }
      
      // Update user in Supabase
      const { data, error } = await supabase
        .from('users')
        .update({
          email: primaryEmail,
          username: username || primaryEmail.split('@')[0],
          full_name: `${first_name || ''} ${last_name || ''}`.trim(),
          avatar_url: image_url,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user in Supabase:', error);
        return NextResponse.json(
          { error: 'Error updating user' },
          { status: 500 }
        );
      }
      
      console.log(`User ${id} updated in Supabase`);
      return NextResponse.json({ message: 'User updated', data });
    }
    
    else if (eventType === 'user.deleted') {
      // User is deleted from Clerk
      const { id } = evt.data;
      
      // Delete user from Supabase
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', id);
      
      if (error) {
        console.error('Error deleting user from Supabase:', error);
        return NextResponse.json(
          { error: 'Error deleting user' },
          { status: 500 }
        );
      }
      
      console.log(`User ${id} deleted from Supabase`);
      return NextResponse.json({ message: 'User deleted' });
    }
    
    // Return a response for any unhandled event types
    return NextResponse.json({ message: `Unhandled event type: ${eventType}` });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}