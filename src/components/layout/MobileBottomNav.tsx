'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListVideo, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'LLD', href: '/lld', icon: ListVideo },
  { name: 'HLD', href: '/hld', icon: ListVideo },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-card/80 backdrop-blur-xl z-50 flex items-center justify-around px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
              isActive ? 'text-indigo-500' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive && "animate-bounce")} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
