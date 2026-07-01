import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { EditProfileModal } from "./edit-profile-modal";

export function ProfileHeader() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="h-28 bg-gradient-to-br from-surface-overlay to-surface-raised sm:h-36" />

      <div className="bg-surface px-5 pb-6 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-10 flex items-end gap-4 sm:-mt-11">
            <div className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl border-4 border-surface bg-gradient-to-br from-accent to-gold font-heading text-2xl font-extrabold text-background sm:h-24 sm:w-24 sm:text-3xl">
              AO
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-extrabold text-foreground sm:text-2xl">
                  Amara Okonkwo
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-gold bg-surface-raised px-2.5 py-1 text-[11px] font-bold text-gold">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              </div>
              <p className="mt-0.5 text-sm text-foreground-muted">Oil &amp; mixed media · Lagos, Nigeria</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <EditProfileModal />
            <Link
              href="/artists"
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised"
            >
              View public page →
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground-muted">
          <span>
            <strong className="font-heading font-extrabold text-foreground">18</strong> Works
          </span>
          <span>
            <strong className="font-heading font-extrabold text-foreground">1,240</strong> Followers
          </span>
          <span>
            <strong className="font-heading font-extrabold text-foreground">86</strong> Following
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Open to commissions
          </span>
        </div>
      </div>
    </div>
  );
}
