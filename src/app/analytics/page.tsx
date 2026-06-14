'use client';

import { useTrackerStore } from '@/store/useTrackerStore';
import { useHydration } from '@/hooks/useHydration';
import { StatCard } from '@/components/tracker/StatCard';
import { Target, Flame, Activity, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { format, isToday } from 'date-fns';

export default function Analytics() {
  const hydrated = useHydration();
  const store = useTrackerStore();

  if (!hydrated) {
    return <div className="animate-pulse h-[60vh] flex items-center justify-center">Loading Analytics...</div>;
  }

  const lldVideos = store.lldProgress;
  const hldVideos = store.hldProgress;
  
  const lldCompleted = lldVideos.filter(v => v.completed).length;
  const hldCompleted = hldVideos.filter(v => v.completed).length;
  const totalCompleted = lldCompleted + hldCompleted;
  const totalVideos = lldVideos.length + hldVideos.length;
  const totalPercentage = totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0;
  const lldPercentage = Math.round((lldCompleted / lldVideos.length) * 100);
  const hldPercentage = Math.round((hldCompleted / hldVideos.length) * 100);

  const completedToday = [...lldVideos, ...hldVideos].filter(v => 
    v.completed && v.completedAt && isToday(v.completedAt)
  ).length;

  // Process data for Timeline (last 7 days activity)
  const activityMap = new Map<string, number>();
  [...lldVideos, ...hldVideos].forEach(v => {
    if (v.completed && v.completedAt) {
      const date = format(v.completedAt, 'MMM dd');
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    }
  });
  
  const timelineData = Array.from(activityMap.entries())
    .map(([date, count]) => ({ date, completed: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 active days

  const pieData = [
    { name: 'LLD', value: lldCompleted, color: 'var(--indigo-500)' },
    { name: 'HLD', value: hldCompleted, color: 'var(--purple-500)' },
    { name: 'Remaining', value: totalVideos - totalCompleted, color: 'hsl(var(--muted))' }
  ];

  const barData = [
    { name: 'LLD', completed: lldCompleted, remaining: lldVideos.length - lldCompleted },
    { name: 'HLD', completed: hldCompleted, remaining: hldVideos.length - hldCompleted },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your study habits.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Completion"
          value={`${totalPercentage}%`}
          subtitle={`${totalCompleted}/${totalVideos}`}
          icon={Target}
          iconClassName="bg-primary/20 text-primary"
        />
        <StatCard
          title="Study Streak"
          value={store.streak.count}
          subtitle="Days"
          icon={Flame}
          iconClassName="bg-orange-500/20 text-orange-500"
        />
        <StatCard
          title="Videos Today"
          value={completedToday}
          icon={Activity}
          iconClassName="bg-emerald-500/20 text-emerald-500"
        />
        <StatCard
          title="Total Notes"
          value={Object.keys(store.notes).length}
          icon={CheckSquare}
          iconClassName="bg-blue-500/20 text-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Completion Timeline (Last 7 Active Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Not enough data yet. Complete some videos!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Progress Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'hsl(var(--muted))', opacity: 0.2}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                <Bar dataKey="remaining" stackId="a" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
