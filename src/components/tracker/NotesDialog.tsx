'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTrackerStore } from '@/store/useTrackerStore';
import { format } from 'date-fns';

interface NotesDialogProps {
  videoId: string;
  videoTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NotesDialog({ videoId, videoTitle, isOpen, onClose }: NotesDialogProps) {
  const note = useTrackerStore((state) => state.notes[videoId]);
  const saveNote = useTrackerStore((state) => state.saveNote);
  const deleteNote = useTrackerStore((state) => state.deleteNote);

  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setContent(note?.content || '');
    }
  }, [isOpen, note]);

  const handleSave = () => {
    if (content.trim()) {
      saveNote(videoId, content);
    } else {
      deleteNote(videoId);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#171717] border-[#262626] p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-[#262626]">
          <DialogTitle className="text-foreground text-base">Notes for {videoTitle}</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your notes here..."
            className="min-h-[200px] resize-none bg-[#0A0A0A] border-[#262626] focus-visible:ring-primary"
          />
          {note?.timestamp && (
            <p className="text-xs text-muted-foreground mt-3">
              Last edited: {format(note.timestamp, 'PPp')}
            </p>
          )}
        </div>
        <DialogFooter className="px-6 py-4 border-t border-[#262626] bg-[#111111] m-0">
          <Button variant="outline" onClick={onClose} className="bg-transparent border-[#404040] hover:bg-[#262626] hover:text-foreground">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
