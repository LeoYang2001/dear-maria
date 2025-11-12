import type { PinType } from "../components/PlaceMarker";
import type { Pin } from "../types/common/Pin";

export const mockPins: Pin[] = [
  {
    id: "1",
    lat: 40.7128,
    lng: -74.006,
    name: "New York",
    description: "Times Square, Central Park, Statue of Liberty",
    type: "visited",
    visitedTime: "2023-05-15T10:30:00Z",
    pictureURL:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    lat: 34.0522,
    lng: -118.2437,
    name: "Los Angeles",
    description: "Hollywood, Griffith Observatory, Santa Monica Pier",
    type: "visited",
    visitedTime: "2023-08-22T14:00:00Z",
  },
  {
    id: "3",
    lat: 51.5074,
    lng: -0.1278,
    name: "London",
    description: "Big Ben, Tower Bridge, British Museum",
    type: "wishlist",
    pictureURL:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    lat: 48.8566,
    lng: 2.3522,
    name: "Paris",
    description: "Eiffel Tower, Louvre Museum, Notre-Dame",
    type: "visited",
    visitedTime: "2023-06-10T09:15:00Z",
    pictureURL:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    lat: 35.6762,
    lng: 139.6503,
    name: "Tokyo",
    description: "Shibuya Crossing, Senso-ji Temple, Tsukiji Market",
    type: "wishlist",
    pictureURL:
      "https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    lat: -33.8688,
    lng: 151.2093,
    name: "Sydney",
    description: "Opera House, Harbour Bridge, Bondi Beach",
    type: "visited",
    visitedTime: "2024-01-05T16:45:00Z",
    pictureURL:
      "https://images.unsplash.com/photo-1506973404872-a4a79ca01a24?w=400&h=300&fit=crop",
  },
  {
    id: "7",
    lat: 41.9028,
    lng: 12.4964,
    name: "Rome",
    description: "Colosseum, Vatican, Roman Forum",
    type: "wishlist",
    pictureURL:
      "https://images.unsplash.com/photo-1552832860-cfde2038a72d?w=400&h=300&fit=crop",
  },
  {
    id: "8",
    lat: 37.7749,
    lng: -122.4194,
    name: "San Francisco",
    description: "Golden Gate Bridge, Cable Cars, Alcatraz",
    type: "visited",
    visitedTime: "2023-09-18T11:20:00Z",
    pictureURL:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
  },
  {
    id: "9",
    lat: 19.4326,
    lng: -99.1332,
    name: "Mexico City",
    description: "Frida Kahlo Museum, Templo Mayor, Xochimilco",
    type: "wishlist",
    pictureURL:
      "https://images.unsplash.com/photo-1518423591714-ee0ff1444ff0?w=400&h=300&fit=crop",
  },
  {
    id: "10",
    lat: 55.7558,
    lng: 37.6173,
    name: "Moscow",
    description: "Red Square, Kremlin, St. Basil's Cathedral",
    type: "visited",
    visitedTime: "2023-11-12T13:30:00Z",
    pictureURL:
      "https://images.unsplash.com/photo-1513653866935-59bdc6caf20b?w=400&h=300&fit=crop",
  },
];
