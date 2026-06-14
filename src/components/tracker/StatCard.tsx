'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, className, iconClassName }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden bg-[#171717] border-[#262626] transition-all duration-200 hover:border-primary/50 shadow-none rounded-[12px]", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{value}</h2>
              {subtitle && <span className="text-xs font-medium text-muted-foreground">{subtitle}</span>}
            </div>
          </div>
          <div className={cn("text-muted-foreground", iconClassName)}>
            <Icon className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
