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
    <Card className={cn("overflow-hidden bg-card/40 backdrop-blur-md border-border/50", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">{value}</h2>
              {subtitle && <span className="text-sm font-medium text-muted-foreground">{subtitle}</span>}
            </div>
          </div>
          <div className={cn("p-3 rounded-xl bg-primary/10", iconClassName)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
