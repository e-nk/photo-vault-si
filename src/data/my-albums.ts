import { Album } from '@/data/dummy-albums';
import { Photo, getDummyPhotosForAlbum } from '@/data/dummy-photos';

// Define a more detailed album type for the My Albums page
export interface MyAlbum extends Album {
  isPrivate: boolean;
  dateUpdated: string;
  description?: string;
  coverPhotoId?: number;
}

// Create dummy data for My Albums
export const getMyAlbums = (): MyAlbum[] => {
  return [
    {
      id: 901,
      userId: 1, // Current user ID
      title: "Landscapes 2023",
      coverImage: "/api/placeholder/1.jpg",
      photoCount: 16,
      dateCreated: "2023-09-15",
      isPrivate: false,
      dateUpdated: "2023-10-18",
      description: "Beautiful landscapes captured during my travels in 2023."
    },
    {
      id: 902,
      userId: 1,
      title: "Family Vacation",
      coverImage: "/api/placeholder/300/200",
      photoCount: 24,
      dateCreated: "2023-08-10",
      isPrivate: true,
      dateUpdated: "2023-08-15",
      description: "Our family trip to the beach."
    },
    {
      id: 903,
      userId: 1,
      title: "City Architecture",
      coverImage: "/api/placeholder/300/200",
      photoCount: 12,
      dateCreated: "2023-07-22",
      isPrivate: false,
      dateUpdated: "2023-09-05",
      description: "Urban geometry and architectural details from my city walks."
    },
    {
      id: 904,
      userId: 1,
      title: "Wildlife Photography",
      coverImage: "/api/placeholder/300/200",
      photoCount: 8,
      dateCreated: "2023-06-18",
      isPrivate: false,
      dateUpdated: "2023-06-30"
    },
    {
      id: 905,
      userId: 1,
      title: "Personal Projects",
      coverImage: "/api/placeholder/300/200",
      photoCount: 5,
      dateCreated: "2023-05-04",
      isPrivate: true,
      dateUpdated: "2023-09-22",
      description: "Creative experiments and personal photography projects."
    }
  ];
};

// Function to get a specific album by ID
export const getMyAlbumById = (albumId: number): MyAlbum | undefined => {
  const albums = getMyAlbums();
  return albums.find(album => album.id === albumId);
};

// Get photos for a specific album owned by the current user
// Simply reuse the existing function as these are mock data
export const getPhotosForMyAlbum = (albumId: number): Photo[] => {
  // Reuse the existing function since we're working with mock data
  // In a real app, you'd have a separate endpoint for user-owned albums
  return getDummyPhotosForAlbum(albumId);
};

// Create a new album
export const createAlbum = (
  title: string,
  description?: string,
  isPrivate: boolean = false
): MyAlbum => {
  const newAlbum: MyAlbum = {
    id: Date.now(), // Use timestamp as temporary ID
    userId: 1, // Current user ID
    title,
    coverImage: "/api/placeholder/300/200",
    photoCount: 0,
    dateCreated: new Date().toISOString().split('T')[0],
    isPrivate,
    dateUpdated: new Date().toISOString().split('T')[0],
    description
  };
  
  return newAlbum;
};

// Update album details
export const updateAlbumDetails = (
  albumId: number,
  updates: Partial<MyAlbum>
): MyAlbum | undefined => {
  const album = getMyAlbumById(albumId);
  
  if (!album) return undefined;
  
  return {
    ...album,
    ...updates,
    dateUpdated: new Date().toISOString().split('T')[0]
  };
};