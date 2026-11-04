"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

const HOME_BY_ROLE = { artist: "/dashboard", collector: "/collector" } as const;

/**
 * Sends a signed-in user to their own section if they land in the other role's area
 * (e.g. a collector opening /dashboard). Signed-out visitors and admins are left alone.
 */
export function RoleGuard({ allow }: { allow: "artist" | "collector" }) {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    if ((role === "artist" || role === "collector") && role !== allow) {
      router.replace(HOME_BY_ROLE[role]);
    }
  }, [role, allow, router]);

  return null;
}
