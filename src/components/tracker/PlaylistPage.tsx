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

  const completedCount = videos.filter(v => v.completed).length;
  const percentage = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;

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
    <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="bg-[#171717] border border-[#262626] p-6 rounded-[12px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {completedCount} of {videos.length} completed
            </p>
          </div>
          <Button onClick={() => window.open(youtubeLink, '_blank')} className="shrink-0 bg-[#262626] hover:bg-[#333333] text-foreground border border-[#404040]">
            Open Playlist <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2 bg-[#1F1F1F]" indicatorClassName="bg-gradient-to-r from-primary to-[#FF9A3C]" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by video number or title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#171717] border-[#262626] focus-visible:ring-primary h-10"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 border border-[#262626] bg-[#171717] hover:bg-[#262626] hover:text-foreground h-10 px-4 py-2">
              <Filter className="w-4 h-4 mr-2" />
              {filter === 'all' ? 'All' : filter === 'completed' ? 'Completed' : 'Pending'}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#171717] border-[#262626]">
              <DropdownMenuItem onClick={() => setFilter('all')}>All Videos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('pending')}>Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 border border-[#262626] bg-[#171717] hover:bg-[#262626] hover:text-foreground h-10 px-4 py-2">
              <ArrowDownUp className="w-4 h-4 mr-2" />
              Sort
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#171717] border-[#262626]">
              <DropdownMenuItem onClick={() => setSort('asc')}>Ascending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('desc')}>Descending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border border-[#262626] rounded-[8px] bg-[#171717] flex flex-col overflow-hidden">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} playlist={playlistType} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No videos found matching your filters.
          </div>
        )}
      </div>

      {percentage === 100 && <ConfettiOverlay show={true} />}
    </div>
  );
}
