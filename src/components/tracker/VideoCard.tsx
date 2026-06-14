'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit3, CheckCircle2 } from 'lucide-react';
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300",
          video.completed 
            ? "bg-primary/5 border-primary/20" 
            : "bg-card/40 border-border/50 hover:bg-card/80 hover:border-border"
        )}
      >
        <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
          <button
            onClick={() => toggleVideo(playlist, video.id)}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors",
              video.completed 
                ? "bg-primary border-primary text-primary-foreground" 
                : "border-muted-foreground/30 text-transparent hover:border-primary"
            )}
          >
            <Check className="w-4 h-4" />
          </button>
          
          <div>
            <h3 className={cn(
              "font-medium transition-colors",
              video.completed ? "text-muted-foreground line-through" : "text-foreground"
            )}>
              {video.index}. {video.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {video.completed && video.completedAt && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  {format(video.completedAt, 'MMM d, yyyy')}
                </span>
              )}
              {note && (
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  Has Notes
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1.5 h-8"
            onClick={() => setIsNotesOpen(true)}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {note ? 'Edit Notes' : 'Add Notes'}
          </Button>
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
