'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTrackerStore } from '@/store/useTrackerStore';
import { useHydration } from '@/hooks/useHydration';
import { VideoCard } from '@/components/tracker/VideoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Search, ExternalLink, Filter, ArrowDownUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfettiOverlay } from '@/components/tracker/ConfettiOverlay';

interface PlaylistPageProps {
  title: string;
  playlistType: 'lld' | 'hld';
  youtubeLink: string;
}

export function PlaylistPage({ title, playlistType, youtubeLink }: PlaylistPageProps) {
  const hydrated = useHydration();
  const store = useTrackerStore();
  const videos = store[playlistType === 'lld' ? 'lldProgress' : 'hldProgress'];

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [showConfetti, setShowConfetti] = useState(false);

  const completedCount = videos.filter(v => v.completed).length;
  const percentage = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;

  useEffect(() => {
    // Check if exactly hit 25%, 50%, 75%, 100% boundary (or newly hit)
    // For simplicity, just show confetti if it reaches 100% just now
    // A robust way would require tracking previous state, but we'll keep it simple:
    if (percentage === 100 && hydrated && videos.length > 0) {
       // Ideally we check if they JUST reached it, but we can just show it once.
       // Let's just show it if they click a video and it reaches 100%.
       // The store update will trigger re-render.
       // If completedCount === videos.length
    }
  }, [percentage, hydrated, videos.length]);

  const filteredVideos = useMemo(() => {
    return videos
      .filter(v => {
        if (filter === 'completed') return v.completed;
        if (filter === 'pending') return !v.completed;
        return true;
      })
      .filter(v => 
        v.title.toLowerCase().includes(search.toLowerCase()) || 
        v.index.toString() === search
      )
      .sort((a, b) => {
        if (sort === 'asc') return a.index - b.index;
        return b.index - a.index;
      });
  }, [videos, filter, search, sort]);

  if (!hydrated) {
    return <div className="animate-pulse h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-card/40 backdrop-blur-md border border-border p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1">
              {completedCount} of {videos.length} completed
            </p>
          </div>
          <Button onClick={() => window.open(youtubeLink, '_blank')} className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
            Open Playlist <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progress</span>
            <span className="text-indigo-400">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-3" indicatorClassName="bg-indigo-500" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by video number or title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card/40"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-card/40 shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <Filter className="w-4 h-4 mr-2" />
              {filter === 'all' ? 'All' : filter === 'completed' ? 'Completed' : 'Pending'}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>All Videos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('pending')}>Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-card/40 shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <ArrowDownUp className="w-4 h-4 mr-2" />
              Sort
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSort('asc')}>Ascending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('desc')}>Descending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-3">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} playlist={playlistType} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No videos found matching your filters.
          </div>
        )}
      </div>

      {percentage === 100 && <ConfettiOverlay show={true} />}
    </div>
  );
}
