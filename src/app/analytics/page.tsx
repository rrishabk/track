'use client';

import { useTrackerStore } from '@/store/useTrackerStore';
import { useHydration } from '@/hooks/useHydration';
import { StatCard } from '@/components/tracker/StatCard';
import { Target, Flame, Activity, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area
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

  const completedToday = [...lldVideos, ...hldVideos].filter(v => 
    v.completed && v.completedAt && isToday(v.completedAt)
  ).length;

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
    .slice(-7);

  const barData = [
    { name: 'LLD', completed: lldCompleted, remaining: lldVideos.length - lldCompleted },
    { name: 'HLD', completed: hldCompleted, remaining: hldVideos.length - hldCompleted },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Deep dive into your study habits.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Completion"
          value={`${totalPercentage}%`}
          subtitle={`${totalCompleted}/${totalVideos}`}
          icon={Target}
          iconClassName="text-muted-foreground"
        />
        <StatCard
          title="Study Streak"
          value={store.streak.count}
          subtitle="Days"
          icon={Flame}
          iconClassName="text-primary"
        />
        <StatCard
          title="Videos Today"
          value={completedToday}
          icon={Activity}
          iconClassName="text-muted-foreground"
        />
        <StatCard
          title="Total Notes"
          value={Object.keys(store.notes).length}
          icon={CheckSquare}
          iconClassName="text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#171717] border-[#262626] shadow-none rounded-[12px]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Completion Timeline (Last 7 Active Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="date" stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#FF7A00" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Not enough data yet. Complete some videos!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#171717] border-[#262626] shadow-none rounded-[12px]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Progress Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: '#262626', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="completed" stackId="a" fill="#FF7A00" radius={[0, 0, 4, 4]} />
                <Bar dataKey="remaining" stackId="a" fill="#262626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
