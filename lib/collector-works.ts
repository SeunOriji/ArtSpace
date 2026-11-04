import { artworks } from "@/lib/artworks";
import type { CartItem } from "@/store/cart.store";

export type CollectorMedium = "painting" | "sculpture" | "photography" | "textile" | "ceramic" | "print";
export type ShipFrom = "Nigeria" | "Ghana" | "Kenya";

export interface CollectorWork {
  id: string;
  title: string;
  artist: string;
  medium: CollectorMedium;
  mediumLabel: string;
  price: number;
  tag: string;
  tagTone: "gold" | "accent" | "green" | "muted";
  city: string;
  country: ShipFrom;
  edition: string;
  isNew?: boolean;
  isLimited?: boolean;
  followed?: boolean;
  trending: number;
  image?: string;
  imageLarge?: string;
}

function img(i: number) {
  return { image: artworks[i]?.image, imageLarge: artworks[i]?.imageLarge };
}

export const collectorWorks: CollectorWork[] = [
  { id: "hd", title: "Harmattan Dusk", artist: "Tunde Adeyemi", medium: "painting", mediumLabel: "Oil", price: 620_000, tag: "Limited · 5/20", tagTone: "gold", city: "Lagos", country: "Nigeria", edition: "Edition 5 of 20", isLimited: true, followed: true, trending: 9, ...img(3) },
  { id: "rt", title: "Reclaimed Throne", artist: "Ngozi Eze", medium: "sculpture", mediumLabel: "Mixed media", price: 1_200_000, tag: "Original", tagTone: "muted", city: "Lagos", country: "Nigeria", edition: "Original · 1 of 1", followed: true, trending: 10, ...img(7) },
  { id: "cf", title: "Clay & Fire", artist: "Adaeze Nwosu", medium: "ceramic", mediumLabel: "Ceramic", price: 210_000, tag: "New", tagTone: "accent", city: "Lagos", country: "Nigeria", edition: "Original · 1 of 1", isNew: true, trending: 6, ...img(8) },
  { id: "ag", title: "Ancestral Gold", artist: "Amara Okonkwo", medium: "painting", mediumLabel: "Acrylic", price: 486_000, tag: "Price drop", tagTone: "green", city: "Lagos", country: "Nigeria", edition: "Original · 1 of 1", trending: 8, ...img(2) },
  { id: "md", title: "Market Day", artist: "Femi Ojo", medium: "painting", mediumLabel: "Oil", price: 390_000, tag: "Original", tagTone: "muted", city: "Accra", country: "Ghana", edition: "Original · 1 of 1", trending: 5, ...img(5) },
  { id: "rm", title: "River Memory", artist: "Chuka Ibe", medium: "photography", mediumLabel: "Photography", price: 175_000, tag: "Edition · 3/15", tagTone: "gold", city: "Enugu", country: "Nigeria", edition: "Edition 3 of 15", isLimited: true, trending: 4, ...img(10) },
  { id: "nm", title: "Night Masquerade", artist: "Bola Taiwo", medium: "sculpture", mediumLabel: "Bronze", price: 880_000, tag: "Limited · 2/10", tagTone: "gold", city: "Ibadan", country: "Nigeria", edition: "Edition 2 of 10", isLimited: true, followed: true, trending: 7, ...img(4) },
  { id: "it", title: "Indigo Threads", artist: "Wanjiru Kamau", medium: "textile", mediumLabel: "Textile", price: 260_000, tag: "New", tagTone: "accent", city: "Nairobi", country: "Kenya", edition: "Original · 1 of 1", isNew: true, trending: 3, ...img(12) },
  { id: "ld", title: "Lagos at Dawn", artist: "Kwame Boateng", medium: "print", mediumLabel: "Print", price: 95_000, tag: "Edition · 8/50", tagTone: "gold", city: "Lagos", country: "Nigeria", edition: "Edition 8 of 50", isLimited: true, trending: 2, ...img(11) },
  { id: "sh", title: "Sunday Hymn", artist: "Amara Okonkwo", medium: "painting", mediumLabel: "Oil", price: 540_000, tag: "Original", tagTone: "muted", city: "Lagos", country: "Nigeria", edition: "Original · 1 of 1", trending: 1, ...img(14) },
  { id: "bw", title: "Beadwork Study", artist: "Wanjiru Kamau", medium: "textile", mediumLabel: "Beadwork", price: 145_000, tag: "Original", tagTone: "muted", city: "Nairobi", country: "Kenya", edition: "Original · 1 of 1", trending: 2, ...img(16) },
  { id: "co", title: "Coastline Ochre", artist: "Femi Ojo", medium: "photography", mediumLabel: "Photography", price: 120_000, tag: "New", tagTone: "accent", city: "Accra", country: "Ghana", edition: "Edition 1 of 10", isNew: true, trending: 3, ...img(17) },
];

export const SHIPPING_PER_ITEM = 12_000;

export function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function formatNairaShort(n: number) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `₦${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  return `₦${Math.round(n / 1000)}k`;
}

export function collectorWorkToCartItem(w: CollectorWork): CartItem {
  return {
    id: w.id,
    title: w.title,
    artist: w.artist,
    mediumLabel: w.mediumLabel,
    price: w.price,
    image: w.image,
    city: w.city,
    edition: w.edition,
  };
}
