import artworksData from "@/data/artworks.json";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  imageLarge: string;
  medium: string;
  year: string;
  culture: string;
  price: number;
  category: string;
}

export const artworks: Artwork[] = artworksData;

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
