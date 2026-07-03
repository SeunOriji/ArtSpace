"use client";

import { useEffect, useState } from "react";

/**
 * Persisted zustand stores rehydrate from localStorage on the client, so their
 * values can differ from the server-rendered default state on first paint.
 * Gate any UI derived from persisted state behind this to avoid a hydration
 * mismatch (server renders the default, client would otherwise render the
 * rehydrated value before React finishes hydrating).
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}
