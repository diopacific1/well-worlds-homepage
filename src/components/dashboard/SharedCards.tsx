import { memo } from "react";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";

export const MetricCard = memo(function MetricCard({
  label,
  value,
  unit,
  trend,
  trendUp,
  badges,
  footerText,
  isLoading,
}: {
  label: string;
  value: string;
  unit: string;
  trend?: string;
  trendUp?: boolean;
  badges?: { text: string; isAccent?: boolean }[];
  footerText?: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="card min-w-[280px] p-6 relative overflow-hidden flex flex-col justify-between animate-pulse">
        <div>
          <div className="w-24 h-4 bg-outline/10 rounded mb-4"></div>
          <div className="w-3/4 h-10 bg-outline/10 rounded-lg mb-2"></div>
          <div className="w-1/2 h-4 bg-outline/10 rounded mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card min-w-[280px] p-6 relative overflow-hidden flex flex-col justify-between group">
      {/* Decorative gradient blob */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
            {label}
          </p>
          {badges && (
            <div className="flex gap-2">
              {badges.map((b: { text: string; isAccent?: boolean }, i: number) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider ${b.isAccent ? "bg-primary border border-primary text-white" : "bg-surface-dim border border-outline/20 text-on-surface"}`}
                >
                  {b.text}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface tracking-tight truncate">
            {value}
          </h2>
          {unit && (
            <span className="text-sm font-semibold font-mono text-on-surface-variant">
              {unit}
            </span>
          )}
        </div>
      </div>
      
      {(trend || footerText) && (
        <div className="mt-6 flex items-center gap-3 relative z-10">
          {trend && (
            <div
              className={`flex items-center text-sm font-semibold font-mono ${trendUp ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-rose-500 bg-rose-500/10 border-rose-500/20"} px-2.5 py-1.5 rounded-lg border`}
            >
              {trendUp ? <TrendingUp className="w-4 h-4 mr-1.5" /> : <TrendingDown className="w-4 h-4 mr-1.5" />}
              <span>{trend}</span>
            </div>
          )}
          {footerText && (
            <span className="text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
              {footerText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export const IndicatorCard = memo(function IndicatorCard({ title, value, sub, color, barValue }: {
  title: string;
  value: string | number;
  sub: string;
  color: "bullish" | "bearish" | "neutral" | "cyber" | string;
  barValue?: number;
}) {
  const isBullish = color === "bullish";
  const isBearish = color === "bearish";
  const isNeutral = color === "neutral";
  
  const tColor = isBullish ? "text-emerald-500" : isBearish ? "text-rose-500" : isNeutral ? "text-amber-500" : "text-primary";
  const bgColor = isBullish ? "bg-emerald-500" : isBearish ? "bg-rose-500" : isNeutral ? "bg-amber-500" : "bg-primary";

  return (
    <div className="bg-surface rounded-2xl p-5 border border-outline/20 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group hover:border-outline/40 transition-colors">
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3 tracking-widest flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> {title}
        </p>
        <p className={`text-2xl font-mono font-bold ${tColor} tracking-tight`}>{value}</p>
      </div>

      <div className="relative z-10 mt-4">
        {barValue !== undefined ? (
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className={`h-full ${bgColor} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, barValue))}%` }}
            ></div>
          </div>
        ) : (
          <p className={`text-[10px] font-bold ${tColor} uppercase tracking-wider`}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
});

export const InsightItem = memo(function InsightItem({ date, label, color }: {
  date: string;
  label: string;
  color: "bullish" | "bearish" | "cyber" | "neutral" | string;
}) {
  const isBullish = color === "bullish";
  const isBearish = color === "bearish";
  const itemColor = isBullish ? "#10b981" : isBearish ? "#f43f5e" : "var(--color-primary)";

  return (
    <div
      className={`p-4 md:p-5 rounded-xl bg-surface border border-outline/10 shadow-sm hover:shadow-md transition-all group flex flex-col gap-2`}
      style={{ borderLeftWidth: "4px", borderLeftColor: itemColor }}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
          style={{ color: itemColor }}
        >
          <Clock className="w-3 h-3" /> {date}
        </p>
        {isBullish && <TrendingUp className="w-3 h-3 text-emerald-500 opacity-50" />}
        {isBearish && <TrendingDown className="w-3 h-3 text-rose-500 opacity-50" />}
      </div>
      <p className="text-sm leading-relaxed text-on-surface font-medium">
        {label}
      </p>
    </div>
  );
});

// A new Live Badge Component
export const LiveBadge = memo(function LiveBadge() {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-[10px] font-bold font-mono tracking-widest uppercase">Live</span>
    </div>
  );
});
