// src/app/data.ts
export interface Event {
  id: number;
  image: string;
  name: string;
  description: string;
  rating: number;
  images: string[];
  link: string;
  date: string;
  place: string;
}

export const CATEGORIES = [...]; // Your category data

export interface Category {
  id: number;
  name: string;
}

export const EVENTS: Event[] = [
  {
    id: 1,
    name: 'Angular Connect 2025',
    image: 'assets/angular-connect.png',
    description: 'A conference for Angular enthusiasts.',
    rating: 4.8,
    link: 'https://angularconnect.com',
    images: [
      'assets/angular-connect.png',
      // ... other images or base64 strings if needed.
    ],
    date: '29 March',
    place: 'Almaty'
  },
  {
    id: 2,
    name: 'NG Conf',
    image: 'assets/ng-conf.png',
    description: 'Join the NG Conf for deep dives into Angular topics.',
    rating: 4.5,
    link: 'https://ng-conf.org',
    images: [
      'assets/ng-conf.png'
      // ... other images.
    ],
    date: '15 April',
    place: 'Almaty'
  }
];
