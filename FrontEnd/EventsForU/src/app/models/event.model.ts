// eventsforu/frontend/src/app/models/event.model.ts

export interface Event {
  id: number;          // From EventSerializer
  name: string;        // From EventSerializer
  location: string;    // From EventSerializer
  date: string;        // From EventSerializer (DateField becomes string)
  duration: number;    // From EventSerializer (FloatField maps to number)
  genre: string;       // From EventSerializer
  price: number;       // From EventSerializer (IntegerField maps to number)
  image: string | null;// From EventSerializer (ImageField becomes URL string or null)
}
