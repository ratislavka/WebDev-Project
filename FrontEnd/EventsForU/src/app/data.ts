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

export interface Category {
  id: number;
  name: string;
  events: Event[];
}

export const CATEGORIES: Category[] = [

];
