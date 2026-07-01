import { UserPlus, Heart, Zap } from "lucide-react";

const activities = [
  {
    id: "1",
    icon: UserPlus,
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    message: "Tunde K. started following you",
    time: "2h ago",
  },
  {
    id: "2",
    icon: Heart,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-400/10",
    message: "Your work Movement No. 4 got 9 likes",
    time: "Yesterday",
  },
  {
    id: "3",
    icon: Zap,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    message: "Welcome to ArtSpace — complete setup to unlock selling",
    time: "2 days ago",
  },
];

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-bold text-foreground">Recent activity</h3>

      <ul className="space-y-4">
        {activities.map(({ id, icon: Icon, iconColor, iconBg, message, time }) => (
          <li key={id} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}
            >
              <Icon size={14} className={iconColor} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug text-foreground">{message}</p>
            </div>
            <span className="flex-shrink-0 whitespace-nowrap text-[11px] text-foreground-subtle">
              {time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
