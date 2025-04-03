import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user session (optional, used for filtering private content)
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    
    // Get search parameters
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const type = url.searchParams.get('type') || 'all'; // all, users, albums, photos
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const page = parseInt(url.searchParams.get('page') || '1');
    const offset = (page - 1) * limit;
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }
    
    // Initialize results object
    const results: any = {};
    
    // Search for users if type is 'all' or 'users'
    if (type === 'all' || type === 'users') {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${query}%, full_name.ilike.%${query}%`)
        .limit(type === 'all' ? 5 : limit)
        .offset(type === 'all' ? 0 : offset);
      
      if (usersError) {
        console.error('Error searching users:', usersError);
      } else {
        results.users = users;
      }
    }
    
    // Search for albums if type is 'all' or 'albums'
    if (type === 'all' || type === 'albums') {
      let albumsQuery = supabase
        .from('albums')
        .select(`
          id, 
          title, 
          description, 
          is_private, 
          cover_photo_url, 
          photo_count,
          created_at,
          user_id,
          users:user_id (
            id, 
            username, 
            full_name, 
            avatar_url
          )
        `)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(type === 'all' ? 5 : limit)
        .offset(type === 'all' ? 0 : offset);
      
      // Filter out private albums that don't belong to the current user
      if (currentUserId) {
        albumsQuery = albumsQuery.or(`is_private.eq.false, user_id.eq.${currentUserId}`);
      } else {
        albumsQuery = albumsQuery.eq('is_private', false);
      }
      
      const { data: albums, error: albumsError } = await albumsQuery;
      
      if (albumsError) {
        console.error('Error searching albums:', albumsError);
      } else {
        results.albums = albums;
      }
    }
    
    // Search for photos if type is 'all' or 'photos'
    if (type === 'all' || type === 'photos') {
      let photosQuery = supabase
        .from('photos')
        .select(`
          id, 
          title, 
          description, 
          url, 
          thumbnail_url,
          created_at,
          album_id,
          albums:album_id (
            id,
            title,
            is_private,
            user_id
          )
        `)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(type === 'all' ? 5 : limit)
        .offset(type === 'all' ? 0 : offset);
      
      const { data: photosWithAlbums, error: photosError } = await photosQuery;
      
      if (photosError) {
        console.error('Error searching photos:', photosError);
      } else {
        // Filter out photos from private albums that don't belong to the current user
        const filteredPhotos = photosWithAlbums?.filter(photo => {
          const album = photo.albums;
          return !album.is_private || album.user_id === currentUserId;
        });
        
        results.photos = filteredPhotos;
      }
    }
    
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}