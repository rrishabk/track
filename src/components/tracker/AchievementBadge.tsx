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
  'first': { title: 'First Step', description: 'Watched your first video', icon: Zap },
  'quarter': { title: '25% Done', description: 'A quarter of the way there', icon: Star },
  'half': { title: 'Halfway There', description: 'Reached 50% completion', icon: Flame },
  'three-quarter': { title: '75% Done', description: 'Almost at the finish line', icon: Award },
  'complete': { title: 'Master', description: 'Completed 100% of the playlist', icon: Trophy },
};

export function AchievementBadge({ type, unlocked, date }: AchievementBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <Popover>
      <PopoverTrigger className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full ring-offset-[#0A0A0A]">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all shadow-none border",
              unlocked 
                ? "bg-[#111111] border-primary/50 text-primary" 
                : "bg-[#111111] border-[#262626] text-muted-foreground opacity-40"
            )}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={unlocked ? 2 : 1.5} />
          </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-56 text-center bg-[#171717] border-[#262626] shadow-2xl">
        <div className="flex flex-col items-center gap-2">
          <div className={cn("p-3 rounded-full border", unlocked ? "bg-[#111111] border-primary/50 text-primary" : "bg-[#111111] border-[#262626] text-muted-foreground")}>
            <Icon className="w-5 h-5" strokeWidth={unlocked ? 2 : 1.5} />
          </div>
          <h4 className="font-semibold text-foreground text-sm">{config.title}</h4>
          <p className="text-xs text-muted-foreground">{config.description}</p>
          {unlocked && date && (
            <p className="text-[10px] font-medium text-primary mt-2 uppercase tracking-wider">Unlocked on {date}</p>
          )}
          {!unlocked && (
            <p className="text-[10px] font-medium text-muted-foreground mt-2 uppercase tracking-wider">Locked</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
