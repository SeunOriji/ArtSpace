"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** Goes back when there is history; legal pages opened in a new tab (from sign-up) go home instead. */
export function BackLink() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover hover:underline"
    >
      <ArrowLeft size={15} />
      Back
    </button>
  );
}
