export interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  dateUploaded: string;
  likes: number;
  comments: number;
  description?: string;
  aspectRatio?: number; // For masonry layout
}

// Function to generate dummy photos for a specific album
export const getDummyPhotosForAlbum = (albumId: number): Photo[] => {
  // Define some aspect ratios for a more realistic masonry layout
  const aspectRatios = [1, 4/3, 3/4, 16/9, 9/16, 1, 5/4, 4/5, 3/2, 2/3];
  
  // Generate a specific number of photos based on the album ID
  const count = 12 + (albumId % 8) * 3; // Between 12 and 33 photos per album
  
  const photos: Photo[] = [];
  
  for (let i = 1; i <= count; i++) {
    const photoId = albumId * 1000 + i;
    const aspectRatioIndex = (albumId + i) % aspectRatios.length;
    
    photos.push({
      id: photoId,
      albumId,
      title: generatePhotoTitle(albumId, i),
      url: `/api/placeholder/1.jpg`,
      thumbnailUrl: `/api/placeholder/1.jpg`,
      dateUploaded: generateRandomDate(2023),
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 15),
      description: i % 3 === 0 ? generatePhotoDescription() : undefined,
      aspectRatio: aspectRatios[aspectRatioIndex],
    });
  }
  
  return photos;
};

// Helper function to generate a random date within a specific year
function generateRandomDate(year: number): string {
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Avoiding month edge cases
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Helper function to generate photo titles
function generatePhotoTitle(albumId: number, index: number): string {
  const albumType = albumId % 5;
  const titles = [
    // Nature
    [
      "Sunset over mountains", "Morning dew on grass", "Autumn leaves", "Winter wonderland",
      "Ocean waves", "Forest path", "Mountain lake", "Desert landscape", "Spring flowers",
      "Starry night", "Rainbow after rain", "Foggy morning", "Summer meadow", "Tropical beach",
      "Waterfall in forest", "Snowy peaks", "Canyon view", "Aurora borealis", "Coral reef"
    ],
    // Urban
    [
      "City skyline", "Downtown at night", "Street art", "Architecture detail",
      "Busy intersection", "Quiet alley", "Modern building", "Historical monument",
      "Urban park", "Subway station", "Bridge at sunset", "Office buildings",
      "City lights", "Urban decay", "Street market", "Traffic trails", "Rooftop view"
    ],
    // People
    [
      "Portrait study", "Candid moment", "Street performer", "Deep in thought",
      "Laughter", "Silhouette at sunset", "Crowd scene", "Musician playing",
      "Artist at work", "Sports action", "Dance movement", "Family gathering",
      "Street style", "Cultural celebration", "Emotional moment", "Wedding day"
    ],
    // Abstract
    [
      "Lines and shapes", "Color study", "Light and shadow", "Reflections",
      "Patterns in nature", "Geometric forms", "Macro texture", "Motion blur",
      "Minimalist composition", "Abstract architecture", "Surreal landscape",
      "Double exposure", "Kaleidoscope effect", "Experimental light", "Hidden details"
    ],
    // Objects
    [
      "Vintage collection", "Still life arrangement", "Everyday objects", "Abandoned items",
      "Mechanical details", "Handcrafted art", "Food composition", "Musical instruments",
      "Technology close-up", "Books and literature", "Fashion details", "Sports equipment",
      "Transportation", "Tools of the trade", "Luxury items", "Historical artifacts"
    ]
  ];
  
  const categoryTitles = titles[albumType];
  return categoryTitles[index % categoryTitles.length];
}

// Helper function to generate photo descriptions
function generatePhotoDescription(): string {
  const descriptions = [
    "Captured this moment during my recent travels. The lighting was perfect!",
    "This shot required a lot of patience, but it was worth the wait.",
    "One of my favorite photos from this collection. What do you think?",
    "Experimenting with new techniques and I'm quite pleased with the result.",
    "Sometimes the best shots are unplanned. Just happened to be in the right place.",
    "This image reminds me of why I fell in love with photography in the first place.",
    "Shot with my trusty 50mm lens. No edits, straight out of camera.",
    "The colors in this scene immediately caught my eye.",
    "There's something about this composition that keeps drawing me back.",
    "This location has been on my photography bucket list for years.",
    "Early morning light creates such a special atmosphere in this scene.",
    "This moment was fleeting, glad I had my camera ready!",
    "I wanted to capture the essence of the place in this single frame.",
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}