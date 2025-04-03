import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/users';
import { uploadPhoto, batchUploadPhotos } from '@/lib/services/photos';

// POST /api/photos/upload - Upload a single photo
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
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    
    // Validate required fields
    if (!albumId || !title || !file) {
      return NextResponse.json({ 
        error: 'Album ID, title, and file are required' 
      }, { status: 400 });
    }
    
    // Calculate aspect ratio
    let aspectRatio = null;
    if (file.type.startsWith('image/')) {
      try {
        const imgBlob = new Blob([await file.arrayBuffer()], { type: file.type });
        const imgUrl = URL.createObjectURL(imgBlob);
        const img = new Image();
        
        // Wait for image to load to get dimensions
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imgUrl;
        });
        
        aspectRatio = img.width / img.height;
        URL.revokeObjectURL(imgUrl);
      } catch (error) {
        console.error('Error calculating aspect ratio:', error);
      }
    }
    
    // Upload the photo
    const photo = await uploadPhoto(albumId, user.id, {
      title,
      description,
      file,
      aspect_ratio: aspectRatio
    });
    
    if (!photo) {
      return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
    }
    
    return NextResponse.json({ photo });
  } catch (error) {
    console.error('Error in upload POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
