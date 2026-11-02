import { CollectorSidebar } from "@/components/collector/collector-sidebar";
import { CollectorBottomNav } from "@/components/collector/collector-bottom-nav";

export default function CollectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CollectorSidebar />
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
      <CollectorBottomNav />
    </div>
  );
}
