'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageSquare, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTrackerStore, VideoItem } from '@/store/useTrackerStore';
import { NotesDialog } from './NotesDialog';
import { format } from 'date-fns';

interface VideoCardProps {
  video: VideoItem;
  playlist: 'lld' | 'hld';
}

export function VideoCard({ video, playlist }: VideoCardProps) {
  const toggleVideo = useTrackerStore((state) => state.toggleVideo);
  const note = useTrackerStore((state) => state.notes[video.id]);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="group flex items-center justify-between py-3 px-4 border-b border-[#262626] last:border-0 hover:bg-[#111111] transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={() => toggleVideo(playlist, video.id)}
            className={cn(
              "flex-shrink-0 w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
              video.completed 
                ? "bg-primary border-primary text-white" 
                : "border-[#404040] text-transparent hover:border-primary"
            )}
          >
            <Check className="w-3 h-3" strokeWidth={3} />
          </button>
          
          <div className="flex items-center gap-3 min-w-0 truncate">
            <span className="text-xs font-mono text-muted-foreground w-6">
              {String(video.index).padStart(2, '0')}
            </span>
            <h3 className={cn(
              "text-sm font-medium truncate transition-colors",
              video.completed ? "text-muted-foreground" : "text-foreground"
            )}>
              {video.title}
            </h3>
            {video.completed && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
                Done
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 pl-4">
          {video.completed && video.completedAt && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {format(video.completedAt, 'MMM d')}
            </span>
          )}
          
          <button 
            onClick={() => setIsNotesOpen(true)}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
              note 
                ? "text-foreground bg-[#262626] hover:bg-[#333333]" 
                : "text-muted-foreground hover:text-foreground hover:bg-[#262626] opacity-0 group-hover:opacity-100"
            )}
            title={note ? "View Notes" : "Add Notes"}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <NotesDialog
        videoId={video.id}
        videoTitle={video.title}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
    </>
  );
}
