"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { createId } from "@/lib/utils";
import { MIN_AGE, TERMS_VERSION, ageOn } from "@/lib/legal";

/** Humans take a few seconds to fill the form; bots submit almost instantly. */
const MIN_FILL_MS = 3000;

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent";

interface Challenge {
  a: number;
  b: number;
}

function newChallenge(): Challenge {
  const n = () => 2 + Math.floor(Math.random() * 8);
  return { a: n(), b: n() };
}

function passwordProblem(pw: string) {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Password must contain both letters and numbers.";
  return null;
}

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState<"artist" | "collector">("artist");
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startedAt = useRef(0);

  // Random values are created after mount so server and client markup match.
  useEffect(() => {
    setChallenge(newChallenge());
    startedAt.current = Date.now();
  }, []);

  function refreshChallenge() {
    setChallenge(newChallenge());
    setAnswer("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setTermsError(true);
      return;
    }

    // Bot traps: the hidden field is only ever filled by scripts.
    if (honeypot) return;
    if (Date.now() - startedAt.current < MIN_FILL_MS) {
      setError("That was quick! Please check your details and try again.");
      return;
    }

    const pwProblem = passwordProblem(password);
    if (pwProblem) return setError(pwProblem);
    if (password !== confirmPassword) return setError("Passwords don't match.");

    if (!dob) return setError("Please enter your date of birth.");
    const age = ageOn(dob, new Date());
    if (Number.isNaN(age) || age > 120) return setError("Please enter a valid date of birth.");
    if (age < MIN_AGE) return setError(`You must be at least ${MIN_AGE} years old to join ArtSpace.`);

    if (!challenge || Number(answer) !== challenge.a + challenge.b) {
      refreshChallenge();
      return setError("The answer to the human check was incorrect. Please try the new one.");
    }

    setIsSubmitting(true);

    // The request body the sign-up API will receive once the backend exists. No timestamp is sent.
    // TODO(backend): validate acceptTerms on the server, and store termsVersion and termsAcceptedAt using SERVER time, never a time sent by the client.
    const payload = { name, email, password, role, dateOfBirth: dob, acceptTerms: true, termsVersion: TERMS_VERSION };

    // Mock sign-up until the backend exists.
    setUser(
      {
        id: createId(),
        name: payload.name,
        email: payload.email,
        role: payload.role,
        isVerified: false,
        plan: "free",
      },
      "mock-token"
    );

    router.push(role === "artist" ? "/dashboard" : "/collector");
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
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
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
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="dob" className="mb-1.5 block text-sm font-medium text-foreground-muted">
              Date of birth
            </label>
            <input
              id="dob"
              type="date"
              autoComplete="bday"
              required
              min="1900-01-01"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
            <p className="mt-1.5 text-xs text-foreground-subtle">You must be {MIN_AGE} or older to join.</p>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
            <p className="mt-1.5 text-xs text-foreground-subtle">At least 8 characters, with letters and numbers.</p>
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-foreground-muted">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
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

          <div className="rounded-xl border border-border bg-surface p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="human-check" className="text-xs font-medium text-foreground-muted">
                Human check
              </label>
              <button
                type="button"
                onClick={refreshChallenge}
                aria-label="Get a new question"
                className="text-foreground-subtle transition-colors hover:text-foreground"
              >
                <RefreshCw size={13} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap font-heading text-base font-bold text-foreground">
                {challenge ? `${challenge.a} + ${challenge.b} =` : "…"}
              </span>
              <input
                id="human-check"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                autoComplete="off"
                value={answer}
                onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
                placeholder="Your answer"
              />
            </div>
          </div>

          {/* Honeypot: hidden from people and screen readers, but bots fill every field. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-foreground-muted">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setTermsError(false);
              }}
              // Replace the browser's tooltip with the inline message below.
              onInvalid={(e) => {
                e.preventDefault();
                setTermsError(true);
              }}
              aria-invalid={termsError}
              aria-describedby={termsError ? "terms-error" : undefined}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-accent"
            />
            <span>
              I confirm I am {MIN_AGE}+ and agree to ArtSpace&apos;s{" "}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {termsError && (
            <p id="terms-error" role="alert" className="-mt-2 text-xs text-red-400">
              Please tick the box to accept the Terms of Service and Privacy Policy.
            </p>
          )}

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            // aria-disabled (not `disabled`) so a click while unticked still shows the inline error.
            aria-disabled={!agreed}
            disabled={isSubmitting}
            className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:bg-accent"
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
