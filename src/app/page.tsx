'use client';

import { useTrackerStore } from '@/store/useTrackerStore';
import { useHydration } from '@/hooks/useHydration';
import { StatCard } from '@/components/tracker/StatCard';
import { AchievementBadge } from '@/components/tracker/AchievementBadge';
import { PlayCircle, Award, CheckCircle2, Flame, BarChart3, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const hydrated = useHydration();
  const store = useTrackerStore();
  const router = useRouter();

  if (!hydrated) {
    return <div className="animate-pulse h-full flex flex-col gap-8">
      <div className="h-16 bg-[#171717] rounded-xl w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="h-32 bg-[#171717] rounded-xl"></div>
        <div className="h-32 bg-[#171717] rounded-xl"></div>
        <div className="h-32 bg-[#171717] rounded-xl"></div>
        <div className="h-32 bg-[#171717] rounded-xl"></div>
      </div>
    </div>;
  }

  const lldCompleted = store.lldProgress.filter(v => v.completed).length;
  const hldCompleted = store.hldProgress.filter(v => v.completed).length;
  const totalCompleted = lldCompleted + hldCompleted;
  const totalVideos = store.lldProgress.length + store.hldProgress.length;
  const totalPercentage = totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0;

  const pieData = [
    { name: 'Completed', value: totalCompleted, color: '#FF7A00' },
    { name: 'Remaining', value: totalVideos - totalCompleted, color: '#262626' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Design Tracker</h1>
        <p className="text-muted-foreground mt-1 text-sm">Track your LLD & HLD journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${totalPercentage}%`}
          subtitle={`${totalCompleted}/${totalVideos}`}
          icon={Award}
          iconClassName="text-muted-foreground"
        />
        <StatCard
          title="LLD Completed"
          value={lldCompleted}
          subtitle={`/ ${store.lldProgress.length}`}
          icon={CheckCircle2}
          iconClassName="text-muted-foreground"
        />
        <StatCard
          title="HLD Completed"
          value={hldCompleted}
          subtitle={`/ ${store.hldProgress.length}`}
          icon={CheckCircle2}
          iconClassName="text-muted-foreground"
        />
        <StatCard
          title="Study Streak"
          value={store.streak.count}
          subtitle="Days"
          icon={Flame}
          iconClassName="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#171717] border-[#262626] shadow-none rounded-[12px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-muted-foreground" />
                Playlists Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3 group cursor-pointer" onClick={() => router.push('/lld')}>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">Low Level Design (LLD)</span>
                  <span className="text-muted-foreground flex items-center gap-2">
                    {lldCompleted} / {store.lldProgress.length}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
                <Progress 
                  value={store.lldProgress.length > 0 ? (lldCompleted / store.lldProgress.length) * 100 : 0} 
                  className="h-2 bg-[#1F1F1F]" 
                  indicatorClassName="bg-gradient-to-r from-primary to-[#FF9A3C]" 
                />
              </div>
              <div className="space-y-3 group cursor-pointer" onClick={() => router.push('/hld')}>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">High Level Design (HLD)</span>
                  <span className="text-muted-foreground flex items-center gap-2">
                    {hldCompleted} / {store.hldProgress.length}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
                <Progress 
                  value={store.hldProgress.length > 0 ? (hldCompleted / store.hldProgress.length) * 100 : 0} 
                  className="h-2 bg-[#1F1F1F]" 
                  indicatorClassName="bg-gradient-to-r from-primary to-[#FF9A3C]" 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#171717] border-[#262626] shadow-none rounded-[12px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <AchievementBadge type="first" unlocked={totalCompleted >= 1} />
                <AchievementBadge type="quarter" unlocked={totalPercentage >= 25} />
                <AchievementBadge type="half" unlocked={totalPercentage >= 50} />
                <AchievementBadge type="three-quarter" unlocked={totalPercentage >= 75} />
                <AchievementBadge type="complete" unlocked={totalPercentage >= 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#171717] border-[#262626] shadow-none rounded-[12px]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[320px]">
            {totalCompleted > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No progress yet.</p>
                <p className="text-sm">Start watching videos to see stats!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
