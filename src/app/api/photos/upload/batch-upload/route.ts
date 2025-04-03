import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { batchUploadPhotos } from '@/lib/services/photos';

// POST /api/photos/batch-upload - Upload multiple photos at once
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
    
    // Parse form data
    const formData = await req.formData();
    const albumId = formData.get('albumId') as string;
    const defaultTitle = formData.get('defaultTitle') as string || 'Untitled Photo';
    
    // Get all files from the form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('files') && value instanceof File) {
        files.push(value);
      }
    }
    
    // Validate required fields
    if (!albumId || files.length === 0) {
      return NextResponse.json({ 
        error: 'Album ID and at least one file are required' 
      }, { status: 400 });
    }
    
    // Upload the photos
    const result = await batchUploadPhotos(albumId, user.id, files, defaultTitle);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in batch upload POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}