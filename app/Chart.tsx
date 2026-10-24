'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Chart({ data }: { data: any[] }) {
  return (
    <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-semibold">Execution performance</h2>
          <p className="text-xs text-slate-500">Success versus failure over time</p>
        </div>
      </div>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="date" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="Success" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSuccess)" />
            <Area type="monotone" dataKey="Failed" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorFailed)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}