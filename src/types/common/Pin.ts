import type { PinType } from "../../components/PlaceMarker";

export interface Pin {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
  type: PinType;
  visitedTime?: string; // ISO date string or null if not visited
  pictureURL?: string; // Optional picture URL for the location
}
