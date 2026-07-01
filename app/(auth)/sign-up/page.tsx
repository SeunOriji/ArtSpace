"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"artist" | "collector">("artist");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    setUser(
      {
        id: crypto.randomUUID(),
        name,
        email,
        role,
        isVerified: false,
        plan: "free",
      },
      "mock-token"
    );

    router.push(role === "artist" ? "/dashboard" : "/marketplace");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="font-heading text-2xl font-extrabold text-foreground">
              Art<span className="text-accent">Space</span>
            </span>
          </Link>
          <h1 className="mt-6 font-heading text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Join ArtSpace and connect with collectors worldwide.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground-muted">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
              placeholder="Oluwaseun Adeyemi"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-foreground-muted">I am joining as a:</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-surface p-3 text-sm font-medium text-foreground-muted transition hover:border-accent hover:text-foreground has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-foreground">
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  className="sr-only"
                  checked={role === "artist"}
                  onChange={() => setRole("artist")}
                />
                Artist
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-surface p-3 text-sm font-medium text-foreground-muted transition hover:border-accent hover:text-foreground has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-foreground">
                <input
                  type="radio"
                  name="role"
                  value="collector"
                  className="sr-only"
                  checked={role === "collector"}
                  onChange={() => setRole("collector")}
                />
                Collector
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
