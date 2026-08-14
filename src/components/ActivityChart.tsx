import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const data = [
  { name: 'Mar', activity: 120, usage: 80 },
  { name: 'Apr', activity: 180, usage: 110 },
  { name: 'May', activity: 250, usage: 160 },
  { name: 'Jun', activity: 220, usage: 190 },
  { name: 'Jul', activity: 380, usage: 250 },
  { name: 'Aug', activity: 490, usage: 310 },
  { name: 'Sep', activity: 620, usage: 430 },
];

export const ActivityChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-surface/40 backdrop-blur-xl border border-outline/10 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden group mt-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative z-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-on-surface tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
              <Activity className="w-5 h-5" />
            </div>
            플랫폼 활동 지표
          </h2>
          <p className="text-on-surface-variant mt-2 font-medium">최근 7개월간의 데이터 활용 및 트래픽 동향</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-sm" />
            <span className="text-on-surface">종합 활동량 (Activity)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-dust shadow-sm" />
            <span className="text-on-surface-variant">데이터 사용량 (Usage)</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sky-dust)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-sky-dust)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline)" strokeOpacity={0.2} vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-on-surface-variant)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--color-on-surface-variant)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                color: 'var(--color-on-surface)',
                border: '1px solid var(--color-outline)'
              }}
              itemStyle={{ fontWeight: 'bold' }}
              labelStyle={{ color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="usage" 
              name="Usage"
              stroke="var(--color-sky-dust)" 
              fillOpacity={1} 
              fill="url(#colorUsage)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="activity" 
              name="Activity"
              stroke="var(--color-primary)" 
              fillOpacity={1} 
              fill="url(#colorActivity)" 
              strokeWidth={3}
              activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
