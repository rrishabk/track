'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListVideo, BarChart2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrackerStore } from '@/store/useTrackerStore';
import { useHydration } from '@/hooks/useHydration';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'LLD Tracker', href: '/lld', icon: ListVideo },
  { name: 'HLD Tracker', href: '/hld', icon: ListVideo },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const hydrated = useHydration();
  const lldProgress = useTrackerStore((state) => state.lldProgress);
  const hldProgress = useTrackerStore((state) => state.hldProgress);

  const lldCompleted = lldProgress.filter((v) => v.completed).length;
  const hldCompleted = hldProgress.filter((v) => v.completed).length;

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-br from-indigo-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-indigo-500" />
          SD Tracker
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {hydrated && (
        <div className="p-4 m-4 rounded-xl bg-muted/50 border border-border">
          <h3 className="text-sm font-semibold mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">LLD</span>
                <span className="font-medium">{lldCompleted}/{lldProgress.length}</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${(lldCompleted / lldProgress.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">HLD</span>
                <span className="font-medium">{hldCompleted}/{hldProgress.length}</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${(hldCompleted / hldProgress.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
