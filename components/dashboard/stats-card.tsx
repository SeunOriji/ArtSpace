import { Eye, Users, Heart, Banknote } from "lucide-react";

const stats = [
  { label: "Profile views", value: "128", icon: Eye, trend: "+12%" },
  { label: "New followers", value: "24", icon: Users, trend: "+3" },
  { label: "Work likes", value: "9", icon: Heart, trend: "+5" },
  { label: "Earnings", value: "₦0", icon: Banknote, trend: null },
];

export function StatsCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Last 7 days</h3>
        <span className="rounded-full bg-surface-raised px-2.5 py-1 text-[10px] font-medium text-foreground-muted">
          Analytics
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, trend }) => (
          <div key={label} className="flex flex-col gap-2 rounded-xl bg-surface-raised p-3">
            <div className="flex items-center justify-between">
              <Icon size={14} className="text-foreground-subtle" />
              {trend && (
                <span className="text-[10px] font-medium text-accent">{trend}</span>
              )}
            </div>
            <p className="font-heading text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-foreground-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
