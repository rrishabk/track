'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListVideo, BarChart2 } from 'lucide-react';
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
    <aside className="hidden lg:flex w-[280px] flex-col border-r border-border bg-[#0A0A0A]">
      <div className="p-6 pb-8">
        <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-primary to-[#FF9A3C]" />
          System Design Tracker
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm transition-all duration-150 relative group',
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[#111111] rounded-md'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary rounded-r-full" />
              )}
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {hydrated && (
        <div className="p-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">LLD</span>
                <span className="font-medium text-foreground">{lldCompleted}/{lldProgress.length}</span>
              </div>
              <div className="h-1 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-[#FF9A3C] rounded-full" 
                  style={{ width: `${(lldCompleted / lldProgress.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">HLD</span>
                <span className="font-medium text-foreground">{hldCompleted}/{hldProgress.length}</span>
              </div>
              <div className="h-1 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-[#FF9A3C] rounded-full" 
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
