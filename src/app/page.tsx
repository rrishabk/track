'use client';

import { useTrackerStore } from '@/store/useTrackerStore';
import { useHydration } from '@/hooks/useHydration';
import { StatCard } from '@/components/tracker/StatCard';
import { AchievementBadge } from '@/components/tracker/AchievementBadge';
import { PlayCircle, Award, CheckCircle2, Flame, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const hydrated = useHydration();
  const store = useTrackerStore();
  const router = useRouter();

  if (!hydrated) {
    return <div className="animate-pulse h-full flex flex-col gap-6">
      <div className="h-32 bg-muted rounded-xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-muted rounded-xl"></div>
        <div className="h-48 bg-muted rounded-xl"></div>
      </div>
    </div>;
  }

  const lldCompleted = store.lldProgress.filter(v => v.completed).length;
  const hldCompleted = store.hldProgress.filter(v => v.completed).length;
  const totalCompleted = lldCompleted + hldCompleted;
  const totalVideos = store.lldProgress.length + store.hldProgress.length;
  const totalPercentage = totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0;

  const lldPercentage = Math.round((lldCompleted / store.lldProgress.length) * 100);
  const hldPercentage = Math.round((hldCompleted / store.hldProgress.length) * 100);

  const pieData = [
    { name: 'Completed', value: totalCompleted, color: 'var(--primary)' },
    { name: 'Remaining', value: totalVideos - totalCompleted, color: 'hsl(var(--muted))' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back! 👋</h1>
          <p className="text-muted-foreground">Here's your system design study progress.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-3 rounded-2xl shadow-sm">
          <div className="p-2 bg-orange-500/10 rounded-full text-orange-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Streak</p>
            <p className="text-xl font-bold">{store.streak.count} Days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Progress"
          value={`${totalPercentage}%`}
          subtitle={`${totalCompleted}/${totalVideos} Videos`}
          icon={Award}
          iconClassName="bg-primary/20 text-primary"
        />
        <StatCard
          title="LLD Mastery"
          value={`${lldPercentage}%`}
          subtitle={`${lldCompleted}/${store.lldProgress.length} Videos`}
          icon={CheckCircle2}
          iconClassName="bg-indigo-500/20 text-indigo-500"
        />
        <StatCard
          title="HLD Mastery"
          value={`${hldPercentage}%`}
          subtitle={`${hldCompleted}/${store.hldProgress.length} Videos`}
          icon={CheckCircle2}
          iconClassName="bg-purple-500/20 text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-muted-foreground" />
                Playlists
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Low Level Design (LLD)</span>
                  <span>{lldCompleted} / {store.lldProgress.length}</span>
                </div>
                <Progress value={lldPercentage} className="h-2 bg-secondary" indicatorClassName="bg-indigo-500" />
                <div className="flex justify-end pt-2">
                  <Button onClick={() => router.push('/lld')} variant="secondary" size="sm">
                    Continue LLD
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>High Level Design (HLD)</span>
                  <span>{hldCompleted} / {store.hldProgress.length}</span>
                </div>
                <Progress value={hldPercentage} className="h-2 bg-secondary" indicatorClassName="bg-purple-500" />
                <div className="flex justify-end pt-2">
                  <Button onClick={() => router.push('/hld')} variant="secondary" size="sm">
                    Continue HLD
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg">Achievement Badges</CardTitle>
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

        <Card className="bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px]">
            {totalCompleted > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
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
