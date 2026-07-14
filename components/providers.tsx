"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { useCommissionsStore } from "@/store/commissions.store";
import { useInteractionsStore } from "@/store/interactions.store";
import { useMessagesStore } from "@/store/messages.store";
import { LightboxProvider } from "@/components/artwork-lightbox";

// These stores persist to localStorage with `skipHydration: true`, so their
// initial state matches the server on first render. Rehydrating them here,
// after mount, brings in the real saved values without causing a
// server/client hydration mismatch.
function useRehydratePersistedStores() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useNotificationsStore.persist.rehydrate();
    useCommissionsStore.persist.rehydrate();
    useInteractionsStore.persist.rehydrate();
    useMessagesStore.persist.rehydrate();
  }, []);
}

export function Providers({ children }: { children: React.ReactNode }) {
  useRehydratePersistedStores();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LightboxProvider>{children}</LightboxProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
