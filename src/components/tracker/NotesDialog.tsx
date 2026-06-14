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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Notes for {videoTitle}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your notes here..."
            className="min-h-[200px] resize-none"
          />
          {note?.timestamp && (
            <p className="text-xs text-muted-foreground mt-2">
              Last edited: {format(note.timestamp, 'PPp')}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
