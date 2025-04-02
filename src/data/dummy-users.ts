export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  albumCount: number;
  avatar: string;
}

export const dummyUsers: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    albumCount: 10,
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    albumCount: 8,
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
    albumCount: 12,
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    username: 'Karianne',
    email: 'Julianne.OConner@kory.org',
    albumCount: 6,
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 5,
    name: 'Chelsey Dietrich',
    username: 'Kamren',
    email: 'Lucio_Hettinger@annie.ca',
    albumCount: 15,
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 6,
    name: 'Mrs. Dennis Schulist',
    username: 'Leopoldo_Corkery',
    email: 'Karley_Dach@jasper.info',
    albumCount: 9,
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 7,
    name: 'Kurtis Weissnat',
    username: 'Elwyn.Skiles',
    email: 'Telly.Hoeger@billy.biz',
    albumCount: 7,
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 8,
    name: 'Nicholas Runolfsdottir V',
    username: 'Maxime_Nienow',
    email: 'Sherwood@rosamond.me',
    albumCount: 11,
    avatar: '/api/placeholder/100/100'
  }
];