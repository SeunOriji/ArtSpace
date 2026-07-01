import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-accent/10 border-b border-accent/20 py-2.5 text-center">
      <p className="text-sm text-foreground-muted">
        Now onboarding the first 1,000 artists — concierge verification included.{" "}
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
        >
          Apply <ArrowRight size={13} />
        </Link>
      </p>
    </div>
  );
}
