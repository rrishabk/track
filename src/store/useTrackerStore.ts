import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export interface VideoItem {
  id: string; // e.g., 'lld-1'
  title: string;
  index: number;
  completed: boolean;
  completedAt: number | null;
}

export interface Note {
  content: string;
  timestamp: number;
}

export interface TrackerState {
  lldProgress: VideoItem[];
  hldProgress: VideoItem[];
  notes: Record<string, Note>;
  streak: {
    lastCompletedDate: string | null;
    count: number;
  };
  
  // Actions
  toggleVideo: (playlist: 'lld' | 'hld', id: string) => void;
  saveNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  resetPlaylist: (playlist: 'lld' | 'hld') => void;
  resetAll: () => void;
  importData: (data: Partial<TrackerState>) => void;
}

const generateVideos = (prefix: string, count: number): VideoItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `Video ${i + 1}`,
    index: i + 1,
    completed: false,
    completedAt: null,
  }));
};

const initialLLD = generateVideos('lld', 48);
const initialHLD = generateVideos('hld', 42);

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set) => ({
      lldProgress: initialLLD,
      hldProgress: initialHLD,
      notes: {},
      streak: { lastCompletedDate: null, count: 0 },

      toggleVideo: (playlist, id) => {
        set((state) => {
          const listKey = playlist === 'lld' ? 'lldProgress' : 'hldProgress';
          const list = state[listKey];
          const videoIndex = list.findIndex((v) => v.id === id);
          if (videoIndex === -1) return state;

          const video = list[videoIndex];
          const now = Date.now();
          const newCompleted = !video.completed;
          const completedAt = newCompleted ? now : null;

          const newList = [...list];
          newList[videoIndex] = { ...video, completed: newCompleted, completedAt };

          // Streak update logic
          let newStreak = { ...state.streak };
          if (newCompleted) {
            const todayStr = format(now, 'yyyy-MM-dd');
            if (state.streak.lastCompletedDate !== todayStr) {
               if (!state.streak.lastCompletedDate) {
                 newStreak = { lastCompletedDate: todayStr, count: 1 };
               } else {
                 const lastDate = new Date(state.streak.lastCompletedDate);
                 const todayDate = new Date(now);
                 // Reset hours to compare pure dates
                 lastDate.setHours(0, 0, 0, 0);
                 todayDate.setHours(0, 0, 0, 0);
                 const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                 
                 if (diffDays === 1) {
                   newStreak = { lastCompletedDate: todayStr, count: state.streak.count + 1 };
                 } else if (diffDays > 1) {
                   newStreak = { lastCompletedDate: todayStr, count: 1 };
                 }
               }
            }
          }

          return {
            [listKey]: newList,
            streak: newStreak,
          };
        });
      },

      saveNote: (id, content) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [id]: { content, timestamp: Date.now() },
          },
        }));
      },

      deleteNote: (id) => {
        set((state) => {
          const newNotes = { ...state.notes };
          delete newNotes[id];
          return { notes: newNotes };
        });
      },

      resetPlaylist: (playlist) => {
        set((state) => ({
          ...state,
          [playlist === 'lld' ? 'lldProgress' : 'hldProgress']: playlist === 'lld' ? initialLLD : initialHLD,
        }));
      },

      resetAll: () => {
        set({
          lldProgress: initialLLD,
          hldProgress: initialHLD,
          notes: {},
          streak: { lastCompletedDate: null, count: 0 },
        });
      },

      importData: (data) => {
        set((state) => ({ ...state, ...data }));
      },
    }),
    {
      name: 'system-design-tracker',
    }
  )
);
