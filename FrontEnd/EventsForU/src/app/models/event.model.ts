// Example: eventsforu/frontend/src/app/models/event.model.ts
export interface Event {
    id: number;
    name: string;
    location: string; // Matches backend model
    date: string;     // Or Date, depending on how Django serializes it
    duration: number; // Matches backend model
    genre: string;    // Matches backend model
    price: number;    // Matches backend model
    image: string | null; // Matches backend model
    // Add any other fields returned by your serializer
}
