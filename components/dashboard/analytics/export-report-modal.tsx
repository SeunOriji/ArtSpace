"use client";

import { useMemo, useState } from "react";
import { Check, Download, FileSpreadsheet, FileText, Mail } from "lucide-react";
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
import { useAuthStore } from "@/store/auth.store";
import { stats, topWorks, sources } from "@/components/dashboard/analytics/analytics-view";

type RangeKey = "7d" | "30d" | "90d" | "custom";
type Format = "pdf" | "csv";
type SectionKey = "overview" | "revenue" | "topWorks" | "audience" | "transactions";

const rangeOptions: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "custom", label: "Custom" },
];

const rangeFileSuffix: Record<RangeKey, string> = {
  "7d": "Jul10-Jul16",
  "30d": "Jun18-Jul16",
  "90d": "Apr18-Jul16",
  custom: "Custom-Range",
};

const sectionOptions: { key: SectionKey; label: string; hint?: string }[] = [
  { key: "overview", label: "Overview stats", hint: "views, followers, sales, revenue" },
  { key: "revenue", label: "Revenue breakdown", hint: "sales vs. commissions" },
  { key: "topWorks", label: "Top performing works" },
  { key: "audience", label: "Audience & traffic sources" },
  { key: "transactions", label: "Individual transactions", hint: "for bookkeeping" },
];

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/₦/g, "NGN ");
}

function buildPdfBlob(title: string, lines: string[]): Blob {
  const body: string[] = ["BT", "/F1 16 Tf", "50 740 Td", `(${escapePdfText(title)}) Tj`, "/F1 10 Tf", "0 -26 Td"];
  for (const line of lines) {
    body.push(`(${escapePdfText(line)}) Tj`, "0 -16 Td");
  }
  body.push("ET");
  const content = body.join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${off.toString().padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function buildCsvBlob(rows: string[][]): Blob {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  return new Blob([csv], { type: "text/csv" });
}

function buildReportRows(selected: Set<SectionKey>): string[][] {
  const rows: string[][] = [["Section", "Metric", "Value"]];
  if (selected.has("overview")) {
    for (const s of stats) rows.push(["Overview", s.label, `${s.value} (${s.delta})`]);
  }
  if (selected.has("revenue")) {
    rows.push(["Revenue", "Sales vs. commissions", "See chart on Analytics page"]);
  }
  if (selected.has("topWorks")) {
    for (const w of topWorks) rows.push(["Top performing works", w.title, `${w.revenue} · ${w.views} views`]);
  }
  if (selected.has("audience")) {
    for (const s of sources) rows.push(["Audience & traffic sources", s.label, `${s.pct}%`]);
  }
  if (selected.has("transactions")) {
    rows.push(["Individual transactions", "Full ledger", "Not included in this export"]);
  }
  return rows;
}

export function ExportReportModal() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<RangeKey>("30d");
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    overview: true,
    revenue: true,
    topWorks: true,
    audience: true,
    transactions: false,
  });
  const [format, setFormat] = useState<Format>("pdf");
  const [emailCopy, setEmailCopy] = useState(false);
  const user = useAuthStore((s) => s.user);

  const selectedSections = useMemo(
    () => new Set(sectionOptions.filter((s) => sections[s.key]).map((s) => s.key)),
    [sections]
  );
  const selectedCount = selectedSections.size;

  const nameSlug = (user?.name ?? "Guest").trim().replace(/\s+/g, "-");
  const filename = `ArtSpace_Report_${nameSlug}_${rangeFileSuffix[range]}.${format}`;
  const estimatedKb = 80 + selectedCount * 90;
  const rows = buildReportRows(selectedSections);

  function toggleSection(key: SectionKey) {
    setSections((s) => ({ ...s, [key]: !s[key] }));
  }

  function handleDownload() {
    const blob =
      format === "pdf"
        ? buildPdfBlob("ArtSpace Analytics Report", [
            `Artist: ${user?.name ?? "Guest"}`,
            `Range: ${rangeOptions.find((r) => r.key === range)?.label ?? range}`,
            "",
            ...rows.slice(1).map((r) => `${r[0]} — ${r[1]}: ${r[2]}`),
          ])
        : buildCsvBlob(rows);

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-overlay"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export report</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>Export report</DialogTitle>
            <DialogDescription>A downloadable summary of your ArtSpace performance.</DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-7">
            <div className="flex flex-col gap-6">
              {/* Date range */}
              <div>
                <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-foreground-muted">Date range</p>
                <div className="flex flex-wrap gap-2">
                  {rangeOptions.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRange(r.key)}
                      className={cn(
                        "rounded-lg px-3.5 py-2.5 text-xs font-bold transition-colors",
                        range === r.key
                          ? "border-[1.5px] border-accent bg-surface-raised text-foreground"
                          : "border border-border bg-background text-foreground-muted hover:text-foreground"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div>
                <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-foreground-muted">
                  Include sections
                </p>
                <div className="flex flex-col gap-2">
                  {sectionOptions.map((s) => {
                    const checked = sections[s.key];
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => toggleSection(s.key)}
                        className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:border-border-subtle"
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {s.label}
                          {s.hint && <span className="ml-1.5 font-medium text-foreground-subtle">· {s.hint}</span>}
                        </span>
                        <span
                          className={cn(
                            "flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md",
                            checked ? "bg-accent" : "border-[1.5px] border-border-subtle"
                          )}
                        >
                          {checked && <Check size={13} className="text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format */}
              <div>
                <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-foreground-muted">Format</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormat("pdf")}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-colors",
                      format === "pdf"
                        ? "border-[1.5px] border-accent bg-surface-raised"
                        : "border-border bg-background hover:border-border-subtle"
                    )}
                  >
                    <FileText size={18} className={format === "pdf" ? "text-accent" : "text-foreground-subtle"} />
                    <span>
                      <span className="block text-sm font-bold text-foreground">PDF</span>
                      <span className="block text-xs font-medium text-foreground-subtle">Formatted summary</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat("csv")}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-colors",
                      format === "csv"
                        ? "border-[1.5px] border-accent bg-surface-raised"
                        : "border-border bg-background hover:border-border-subtle"
                    )}
                  >
                    <FileSpreadsheet
                      size={18}
                      className={format === "csv" ? "text-accent" : "text-foreground-subtle"}
                    />
                    <span>
                      <span className="block text-sm font-bold text-foreground">CSV</span>
                      <span className="block text-xs font-medium text-foreground-subtle">Raw data, spreadsheets</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Email delivery */}
              <button
                type="button"
                onClick={() => setEmailCopy((v) => !v)}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5 text-left"
              >
                <span className="flex items-center gap-3">
                  <Mail size={18} className="text-foreground-subtle" />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">Also email a copy</span>
                    <span className="block text-xs font-medium text-foreground-subtle">
                      {user?.email ?? "you@artspace.art"}
                    </span>
                  </span>
                </span>
                <span
                  className={cn(
                    "relative h-[25px] w-[44px] flex-shrink-0 rounded-full transition-colors",
                    emailCopy ? "bg-accent" : "bg-surface-overlay"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-[3px] h-[19px] w-[19px] rounded-full bg-white transition-all",
                      emailCopy ? "left-[22px]" : "left-[3px]"
                    )}
                  />
                </span>
              </button>

              {/* Preview */}
              <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised p-4">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-background">
                  {format === "pdf" ? (
                    <FileText size={17} className="text-accent" />
                  ) : (
                    <FileSpreadsheet size={17} className="text-accent" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">{filename}</p>
                  <p className="text-xs font-medium text-foreground-subtle">
                    Estimated size: ~{estimatedKb} KB · {format === "pdf" ? "1 page" : `${rows.length} rows`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <span className="hidden text-xs font-medium text-foreground-subtle sm:inline">
              {selectedCount === 0 ? "Select at least one section to export." : `${selectedCount} section(s) selected.`}
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
                type="button"
                disabled={selectedCount === 0}
                onClick={handleDownload}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Download size={14} />
                Download report
              </button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
