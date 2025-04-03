// File path: /app/api/webhooks/clerk/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  // Verify the webhook signature
  const headersList = headers();
  const svixId = headersList.get('svix-id');
  const svixTimestamp = headersList.get('svix-timestamp');
  const svixSignature = headersList.get('svix-signature');
  
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Missing Svix headers' },
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
  
  // Initialize Supabase client
  const supabase = createRouteHandlerClient({ cookies });
  
  // Handle different webhook events
  try {
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
      
      // Create user in Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            clerk_id: id,
            email: primaryEmail,
            username: username || primaryEmail.split('@')[0],
            full_name: `${first_name || ''} ${last_name || ''}`.trim(),
            avatar_url: image_url,
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user in Supabase:', error);
        return NextResponse.json(
          { error: 'Error creating user' },
          { status: 500 }
        );
      }
      
      console.log(`User ${id} created in Supabase`);
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