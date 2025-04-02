export interface Album {
  id: number;
  userId: number;
  title: string;
  coverImage: string;
  photoCount: number;
  dateCreated: string;
}

// Function to generate dummy albums for a specific user
export const getDummyAlbumsForUser = (userId: number): Album[] => {
  // A set of albums specific to each user
  const userAlbums: Record<number, Album[]> = {
    1: [
      {
        id: 101,
        userId: 1,
        title: "Nature Landscapes",
        coverImage: "/api/placeholder/1.jpg",
        photoCount: 24,
        dateCreated: "2023-09-15"
      },
      {
        id: 102,
        userId: 1,
        title: "Urban Architecture",
        coverImage: "/api/placeholder/300/200",
        photoCount: 18,
        dateCreated: "2023-08-22"
      },
      {
        id: 103,
        userId: 1,
        title: "Wildlife Close-ups",
        coverImage: "/api/placeholder/300/200",
        photoCount: 32,
        dateCreated: "2023-07-08"
      },
      {
        id: 104,
        userId: 1,
        title: "Summer Vacation 2023",
        coverImage: "/api/placeholder/300/200",
        photoCount: 56,
        dateCreated: "2023-06-12"
      }
    ],
    2: [
      {
        id: 201,
        userId: 2,
        title: "European Travels",
        coverImage: "/api/placeholder/300/200",
        photoCount: 42,
        dateCreated: "2023-10-05"
      },
      {
        id: 202,
        userId: 2,
        title: "Food Photography",
        coverImage: "/api/placeholder/300/200",
        photoCount: 28,
        dateCreated: "2023-09-18"
      },
      {
        id: 203,
        userId: 2,
        title: "Product Shots",
        coverImage: "/api/placeholder/300/200",
        photoCount: 15,
        dateCreated: "2023-08-30"
      }
    ],
    3: [
      {
        id: 301,
        userId: 3,
        title: "Abstract Art",
        coverImage: "/api/placeholder/300/200",
        photoCount: 19,
        dateCreated: "2023-10-12"
      },
      {
        id: 302,
        userId: 3,
        title: "Night Photography",
        coverImage: "/api/placeholder/300/200",
        photoCount: 23,
        dateCreated: "2023-09-28"
      },
      {
        id: 303,
        userId: 3,
        title: "Macro Photography",
        coverImage: "/api/placeholder/300/200",
        photoCount: 31,
        dateCreated: "2023-08-14"
      },
      {
        id: 304,
        userId: 3,
        title: "Black & White Collection",
        coverImage: "/api/placeholder/300/200",
        photoCount: 27,
        dateCreated: "2023-07-22"
      },
      {
        id: 305,
        userId: 3,
        title: "Street Photography",
        coverImage: "/api/placeholder/300/200",
        photoCount: 34,
        dateCreated: "2023-06-08"
      }
    ]
  };
  
  // Return albums for the requested user or an empty array if none exist
  return userAlbums[userId] || [];
};

// Get all albums for dummy data
export const getAllDummyAlbums = (): Album[] => {
  const allAlbums: Album[] = [];
  
  for (const userId in {1: true, 2: true, 3: true}) {
    allAlbums.push(...getDummyAlbumsForUser(Number(userId)));
  }
  
  return allAlbums;
};