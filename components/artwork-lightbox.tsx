"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxArtwork {
  id: string;
  image: string;
  imageLarge: string;
  title: string;
  artist?: string;
}

interface LightboxContextValue {
  open: (artwork: LightboxArtwork) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useArtworkLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useArtworkLightbox must be used within LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [artwork, setArtwork] = useState<LightboxArtwork | null>(null);

  const open = useCallback((a: LightboxArtwork) => setArtwork(a), []);
  const close = useCallback(() => setArtwork(null), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <ArtworkLightboxOverlay artwork={artwork} onClose={close} />
    </LightboxContext.Provider>
  );
}

function ArtworkLightboxOverlay({
  artwork,
  onClose,
}: {
  artwork: LightboxArtwork | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    if (!artwork) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [artwork]);

  // Focus the close button on open, and wire Escape-to-close.
  useEffect(() => {
    if (!artwork) return;
    closeButtonRef.current?.focus();

    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [artwork, onClose]);

  function handleTrapTab(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.y) > 120 || Math.abs(info.velocity.y) > 600) {
      onClose();
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {artwork && (
        <motion.div className="fixed inset-0 z-[100]">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={artwork.title}
            onKeyDown={handleTrapTab}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:right-6 sm:top-6"
            >
              <X size={20} />
            </button>

            {/* Drag handle — separate element from the layoutId one below, so the
                drag transform and the shared-layout projection transform don't
                fight over control of the same node's `transform` style. */}
            <motion.div
              className="relative z-[1] h-[78vh] w-[92vw] cursor-grab touch-none active:cursor-grabbing sm:h-[85vh] sm:w-[85vw]"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.65}
              onDragEnd={handleDragEnd}
            >
              {/* Shared-element image */}
              <motion.div layoutId={`artwork-${artwork.id}`} className="relative h-full w-full">
                <Image
                  src={artwork.imageLarge}
                  alt={artwork.title}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                  draggable={false}
                />
              </motion.div>
            </motion.div>

            {/* Caption bar */}
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-5 text-center sm:py-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.1 }}
            >
              <p className="font-heading text-base font-bold text-white sm:text-lg">{artwork.title}</p>
              {artwork.artist && <p className="mt-0.5 text-sm text-white/70">{artwork.artist}</p>}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

interface ArtworkThumbnailProps {
  artwork: LightboxArtwork;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/**
 * Drop-in replacement for a `<Image fill className="object-cover" />` line
 * inside an existing `relative` card container — same absolute-fill
 * positioning, so it slots in without touching surrounding card markup.
 */
export function ArtworkThumbnail({ artwork, sizes, className, priority }: ArtworkThumbnailProps) {
  const { open } = useArtworkLightbox();

  return (
    <motion.div
      layoutId={`artwork-${artwork.id}`}
      role="button"
      tabIndex={0}
      aria-label={`View ${artwork.title} fullscreen`}
      onClick={() => open(artwork)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(artwork);
        }
      }}
      className="absolute inset-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
    >
      <Image
        src={artwork.image}
        alt={artwork.title}
        fill
        sizes={sizes}
        className={cn("object-cover", className)}
        priority={priority}
      />
    </motion.div>
  );
}
