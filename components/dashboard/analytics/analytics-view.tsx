"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { artworks } from "@/lib/artworks";
import { ArtworkThumbnail } from "@/components/artwork-lightbox";
import { ExportReportModal } from "@/components/dashboard/analytics/export-report-modal";

type Range = "7d" | "30d" | "90d" | "all";

const ranges: { key: Range; label: string }[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "all", label: "All" },
];

const revenueSeries: Record<Range, { labels: string[]; sales: number[]; commissions: number[] }> = {
  "7d": {
    labels: ["Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15", "Jul 16"],
    sales: [40, 55, 48, 62, 58, 70, 80],
    commissions: [20, 22, 24, 21, 26, 28, 30],
  },
  "30d": {
    labels: ["Jun 18", "Jun 25", "Jul 2", "Jul 9", "Jul 16"],
    sales: [40, 50, 47, 75, 80],
    commissions: [20, 22, 25, 24, 30],
  },
  "90d": {
    labels: ["Apr 18", "May 8", "May 28", "Jun 17", "Jul 7", "Jul 16"],
    sales: [30, 42, 38, 55, 68, 80],
    commissions: [15, 18, 20, 22, 26, 30],
  },
  all: {
    labels: ["2024", "Q1", "Q2", "Q3", "Q4", "2025"],
    sales: [18, 28, 35, 50, 62, 80],
    commissions: [8, 12, 16, 20, 24, 30],
  },
};

export const stats = [
  { label: "Profile views", value: "4,820", delta: "+18%", positive: true },
  { label: "New followers", value: "312", delta: "+9%", positive: true },
  { label: "Works sold", value: "6", delta: "−2%", positive: false },
  { label: "Revenue", value: "₦3.1M", delta: "+24%", positive: true, highlight: true },
];

export const topWorks = [
  { title: "Reclaimed Throne", views: 1240, likes: 512, revenue: "₦1.2M", artworkIndex: 21 },
  { title: "Harmattan Dusk", views: 960, likes: 248, revenue: "₦620k", artworkIndex: 20 },
  { title: "Ancestral Gold", views: 710, likes: 190, revenue: "₦540k", artworkIndex: 24 },
  { title: "Market Day", views: 402, likes: 84, revenue: "₦390k", artworkIndex: 25 },
];

export const sources = [
  { label: "Feed", pct: 48, color: "bg-accent" },
  { label: "Marketplace search", pct: 27, color: "bg-gold" },
  { label: "Direct profile visits", pct: 16, color: "bg-foreground-subtle" },
  { label: "Shared links", pct: 9, color: "bg-blue-400" },
];

export const locations = [
  { flag: "🇳🇬", place: "Lagos, Nigeria", count: "2,110" },
  { flag: "🇬🇧", place: "London, UK", count: "640" },
  { flag: "🇺🇸", place: "New York, US", count: "512" },
  { flag: "🇬🇭", place: "Accra, Ghana", count: "338" },
  { flag: "🇿🇦", place: "Cape Town, SA", count: "204" },
];

const CHART_WIDTH = 560;
const CHART_HEIGHT = 160;

function buildPath(values: number[], width: number, height: number): string {
  if (values.length === 0) return "";
  const max = Math.max(...values, 1);
  const stepX = width / (values.length - 1 || 1);
  return values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - (v / max) * (height - 20) - 10;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function AnalyticsView() {
  const [range, setRange] = useState<Range>("30d");
  const series = revenueSeries[range];

  const salesPath = useMemo(() => buildPath(series.sales, CHART_WIDTH, CHART_HEIGHT), [series.sales]);
  const commissionsPath = useMemo(
    () => buildPath(series.commissions, CHART_WIDTH, CHART_HEIGHT),
    [series.commissions]
  );
  const areaPath = useMemo(
    () => `${salesPath} L${CHART_WIDTH},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`,
    [salesPath]
  );
  const lastPoint = useMemo(() => {
    const max = Math.max(...series.sales, 1);
    const stepX = CHART_WIDTH / (series.sales.length - 1 || 1);
    const i = series.sales.length - 1;
    const x = i * stepX;
    const y = CHART_HEIGHT - (series.sales[i] / max) * (CHART_HEIGHT - 20) - 10;
    return { x, y };
  }, [series.sales]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">Analytics</h1>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-border-subtle">
            {ranges.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                className={cn(
                  "px-3.5 py-2 text-xs font-bold transition-colors",
                  range === r.key
                    ? "bg-accent text-white"
                    : "bg-surface text-foreground-muted hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <ExportReportModal />
        </div>
      </div>

      {/* Stat strip */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border p-4",
              s.highlight ? "border-accent bg-accent/10" : "border-border-subtle bg-surface"
            )}
          >
            <p className={cn("mb-2 text-xs font-semibold", s.highlight ? "text-accent" : "text-foreground-subtle")}>
              {s.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className={cn("font-heading text-2xl font-extrabold", s.highlight ? "text-accent" : "text-foreground")}>
                {s.value}
              </span>
              <span className={cn("text-xs font-bold", s.positive ? "text-emerald-400" : "text-rose-400")}>
                {s.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Revenue chart */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-heading text-base font-bold text-foreground">Revenue over time</p>
              <div className="flex gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-foreground-muted">
                  <span className="h-2 w-2 rounded-sm bg-accent" />
                  Sales
                </span>
                <span className="flex items-center gap-1.5 text-foreground-subtle">
                  <span className="h-2 w-2 rounded-sm bg-border" />
                  Commissions
                </span>
              </div>
            </div>
            <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} width="100%" height="160" preserveAspectRatio="none">
              <line x1="0" y1="20" x2={CHART_WIDTH} y2="20" className="stroke-border-subtle" strokeWidth="1" />
              <line x1="0" y1="60" x2={CHART_WIDTH} y2="60" className="stroke-border-subtle" strokeWidth="1" />
              <line x1="0" y1="100" x2={CHART_WIDTH} y2="100" className="stroke-border-subtle" strokeWidth="1" />
              <line x1="0" y1="140" x2={CHART_WIDTH} y2="140" className="stroke-border-subtle" strokeWidth="1" />
              <path d={areaPath} className="fill-accent/10" />
              <path d={commissionsPath} fill="none" className="stroke-border" strokeWidth="2" strokeDasharray="4 4" />
              <path d={salesPath} fill="none" className="stroke-accent" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={lastPoint.x} cy={lastPoint.y} r="5" className="fill-gold" />
            </svg>
            <div className="mt-1.5 flex justify-between text-[11px] font-medium text-foreground-subtle">
              {series.labels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>

          {/* Top performing works */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="mb-4 font-heading text-base font-bold text-foreground">Top performing works</p>
            <div className="flex flex-col">
              {topWorks.map((w, i) => {
                const artwork = artworks[w.artworkIndex];
                return (
                  <div
                    key={w.title}
                    className={cn(
                      "flex items-center gap-3.5 py-2.5",
                      i !== topWorks.length - 1 && "border-b border-border-subtle"
                    )}
                  >
                    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                      {artwork && (
                        <ArtworkThumbnail
                          artwork={{
                            id: artwork.id,
                            image: artwork.image,
                            imageLarge: artwork.imageLarge,
                            title: w.title,
                            artist: artwork.artist,
                          }}
                          sizes="44px"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-bold text-foreground">{w.title}</p>
                      <p className="text-xs font-medium text-foreground-subtle">
                        {w.views.toLocaleString()} views · {w.likes} likes
                      </p>
                    </div>
                    <span className="flex-shrink-0 font-heading text-sm font-extrabold text-accent">{w.revenue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Sources */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="mb-4 font-heading text-base font-bold text-foreground">Where views come from</p>
            <div className="flex flex-col gap-3.5">
              {sources.map((s) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-foreground">
                    <span>{s.label}</span>
                    <span className="text-foreground-subtle">{s.pct}%</span>
                  </div>
                  <div className="h-[7px] overflow-hidden rounded-full bg-background">
                    <div className={cn("h-full rounded-full", s.color)} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top locations */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="mb-4 font-heading text-base font-bold text-foreground">Top locations</p>
            <div className="flex flex-col gap-2.5 text-sm font-semibold">
              {locations.map((l) => (
                <div key={l.place} className="flex items-center justify-between">
                  <span className="text-foreground">
                    <span className="mr-1.5">{l.flag}</span>
                    {l.place}
                  </span>
                  <span className="text-foreground-subtle">{l.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion */}
          <div className="rounded-2xl border border-accent bg-accent/10 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-foreground">Views → sale conversion</p>
            <p className="my-2 font-heading text-3xl font-extrabold text-accent">1.4%</p>
            <p className="text-xs font-medium text-foreground-muted">
              Above the 0.9% category average.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
