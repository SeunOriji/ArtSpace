import Link from "next/link";
import { Plus } from "lucide-react";
import { artworks as allArtworks } from "@/lib/artworks";
import { ArtworkThumbnail } from "@/components/artwork-lightbox";

const artworks = [
  {
    id: "1",
    label: "Work 01",
    image: allArtworks[20]?.image,
    imageLarge: allArtworks[20]?.imageLarge,
  },
];

const totalSlots = 4;

export function PortfolioPreview() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-foreground">My portfolio</h2>
        <Link href="/dashboard/portfolio" className="text-xs font-medium text-accent hover:underline">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {artworks.map((art) => (
          <div
            key={art.id}
            className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-surface-overlay to-surface-raised"
          >
            {art.image && (
              <ArtworkThumbnail
                artwork={{ id: art.id, image: art.image, imageLarge: art.imageLarge ?? art.image, title: art.label }}
                sizes="120px"
              />
            )}
            <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-background/70 to-transparent p-2">
              <span className="text-[10px] font-semibold text-foreground">{art.label}</span>
            </div>
          </div>
        ))}

        {Array.from({ length: totalSlots - artworks.length }).map((_, i) => (
          <Link
            key={i}
            href="/dashboard/portfolio"
            className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-surface-raised transition-colors hover:border-accent/50 hover:bg-accent/5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-overlay text-foreground-subtle transition-colors group-hover:border-accent/40 group-hover:text-accent">
              <Plus size={13} />
            </span>
            <span className="text-[10px] text-foreground-subtle group-hover:text-accent">Add</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
