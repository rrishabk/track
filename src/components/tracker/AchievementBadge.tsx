'use client';

import { motion } from 'framer-motion';
import { Award, Star, Zap, Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AchievementBadgeProps {
  type: 'first' | 'quarter' | 'half' | 'three-quarter' | 'complete';
  unlocked: boolean;
  date?: string;
}

const badgeConfig = {
  'first': { title: 'First Step', description: 'Watched your first video', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  'quarter': { title: '25% Done', description: 'A quarter of the way there', icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  'half': { title: 'Halfway There', description: 'Reached 50% completion', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  'three-quarter': { title: '75% Done', description: 'Almost at the finish line', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  'complete': { title: 'Master', description: 'Completed 100% of the playlist', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
};

export function AchievementBadge({ type, unlocked, date }: AchievementBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <Popover>
      <PopoverTrigger className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full ring-offset-background">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all shadow-sm",
              unlocked 
                ? cn(config.bg, "shadow-md") 
                : "bg-muted grayscale opacity-50"
            )}
          >
            <Icon className={cn("w-6 h-6 sm:w-8 sm:h-8", unlocked ? config.color : "text-muted-foreground")} />
          </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-56 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className={cn("p-3 rounded-full", config.bg)}>
            <Icon className={cn("w-6 h-6", config.color)} />
          </div>
          <h4 className="font-semibold">{config.title}</h4>
          <p className="text-sm text-muted-foreground">{config.description}</p>
          {unlocked && date && (
            <p className="text-xs font-medium text-primary mt-2">Unlocked on {date}</p>
          )}
          {!unlocked && (
            <p className="text-xs font-medium text-muted-foreground mt-2">Locked</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
