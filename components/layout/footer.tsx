import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Discover", href: "/discover" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Events", href: "/events" },
    { label: "Drop Alerts", href: "/drops" },
  ],
  "For Artists": [
    { label: "Apply to join", href: "/sign-up" },
    { label: "Pricing", href: "/pricing" },
    { label: "Artist Rooms", href: "/artists" },
    { label: "Commission Flow", href: "/commissions" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-extrabold text-foreground">
                Art<span className="text-accent">Space</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-foreground-muted">
              Where African art finds its global voice. Built for artists, collectors, and culture.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-foreground-subtle">
            &copy; {new Date().getFullYear()} ArtSpace. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-foreground-subtle hover:text-foreground-muted">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-foreground-subtle hover:text-foreground-muted">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
