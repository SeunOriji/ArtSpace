"use client";

import { useState, type FormEvent } from "react";
import { Camera, Check, ChevronDown, Globe, Instagram, Linkedin, Pencil, Twitter } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const disciplines = [
  "Oil & mixed media",
  "Acrylic painting",
  "Photography",
  "Sculpture",
  "Textile & fibre art",
  "Digital art",
];

const availabilityOptions = [
  { key: "open", label: "Open to commissions", dot: "bg-emerald-400" },
  { key: "enquiries", label: "Enquiries only", dot: "bg-gold" },
  { key: "closed", label: "Closed", dot: "bg-foreground-subtle" },
] as const;

type AvailabilityKey = (typeof availabilityOptions)[number]["key"];

const MAX_BIO_LENGTH = 280;

export function EditProfileModal() {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Amara Okonkwo");
  const [username, setUsername] = useState("amara.o");
  const [discipline, setDiscipline] = useState(disciplines[0]);
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [bio, setBio] = useState(
    "I paint movement and memory — the way light falls across Lagos at dusk, the textures of cloth and clay. Each work layers oil with reclaimed material from my neighbourhood."
  );
  const [availability, setAvailability] = useState<AvailabilityKey>("open");
  const [instagram, setInstagram] = useState("amara.makes");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("amaraokonkwo.com");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised"
        >
          Edit profile
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>This is what collectors see on your public page.</DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-7">
            {/* Cover + avatar. The avatar overlaps the bottom edge of the cover photo, so it must
                sit outside the cover's own overflow-hidden box — otherwise its lower half gets clipped. */}
            <div className="relative mb-14">
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-background/75 px-3.5 py-2 text-xs font-bold text-foreground transition-colors hover:bg-background"
                >
                  <Camera size={14} className="text-gold" />
                  Change cover
                </button>
              </div>
              <div className="absolute -bottom-[38px] left-6">
                <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-2xl border-4 border-surface bg-gradient-to-br from-accent to-gold font-heading text-3xl font-extrabold text-background">
                  AO
                  <button
                    type="button"
                    aria-label="Change avatar"
                    className="absolute -bottom-2 -right-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-border bg-surface-raised text-gold transition-colors hover:bg-surface-overlay"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Form grid */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Display name">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent"
                />
              </Field>

              <Field label="Username">
                <div className="flex items-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold focus-within:border-accent">
                  <span className="text-foreground-subtle">artspace.art/</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
                  />
                </div>
              </Field>

              <Field label="Primary discipline">
                <div className="relative">
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent"
                  >
                    {disciplines.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted"
                  />
                </div>
              </Field>

              <Field label="Location">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent"
                />
              </Field>

              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <FieldLabel>Artist statement</FieldLabel>
                  <span className="text-xs font-medium text-foreground-subtle">
                    {bio.length} / {MAX_BIO_LENGTH}
                  </span>
                </div>
                <textarea
                  value={bio}
                  maxLength={MAX_BIO_LENGTH}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3.5 text-sm leading-relaxed text-foreground outline-none transition focus:border-accent"
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel className="mb-2.5 block">Availability</FieldLabel>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {availabilityOptions.map((opt) => {
                    const isActive = availability === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setAvailability(opt.key)}
                        className={cn(
                          "flex flex-1 items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-semibold transition-colors",
                          isActive
                            ? "border-accent bg-surface-raised text-foreground"
                            : "border-border bg-background text-foreground-muted hover:text-foreground"
                        )}
                      >
                        <span className={cn("h-[9px] w-[9px] flex-shrink-0 rounded-full", opt.dot)} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <FieldLabel className="mb-2.5 block">Social links</FieldLabel>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <SocialField icon={Instagram} value={instagram} onChange={setInstagram} placeholder="Instagram" />
                  <SocialField icon={Linkedin} value={linkedin} onChange={setLinkedin} placeholder="Add LinkedIn" />
                  <SocialField icon={Twitter} value={twitter} onChange={setTwitter} placeholder="Add X / Twitter" />
                  <SocialField icon={Globe} value={website} onChange={setWebsite} placeholder="Add website" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <span className="hidden text-xs font-medium text-foreground-subtle sm:inline">
              Changes are saved to your public profile.
            </span>
            <div className="flex w-full items-center gap-2.5 sm:w-auto">
              <DialogClose asChild>
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-overlay sm:flex-none"
                >
                  Cancel
                </button>
              </DialogClose>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover sm:flex-none"
              >
                Save changes
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("text-xs font-bold uppercase tracking-wide text-foreground-muted", className)}>
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <FieldLabel className="mb-2 block">{label}</FieldLabel>
      {children}
    </label>
  );
}

function SocialField({
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  icon: typeof Instagram;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-3 focus-within:border-accent">
      <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md bg-surface-overlay text-gold">
        <Icon size={12} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-foreground-subtle placeholder:font-medium"
      />
      {value && <Check size={14} className="flex-shrink-0 text-emerald-400" />}
    </div>
  );
}
