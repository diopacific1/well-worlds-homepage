import { memo } from "react";
import { Gauge } from "lucide-react";

export const FearAndGreed = memo(function FearAndGreed({ score, label }: { score: number, label?: string }) {
  // 0-25: Extreme Fear
  // 26-45: Fear
  // 46-54: Neutral
  // 55-75: Greed
  // 76-100: Extreme Greed
  let status = "Neutral";
  let color = "text-amber-500";
  let bg = "bg-amber-500";
  let gradient = "from-rose-500 via-amber-500 to-emerald-500";

  if (score <= 25) { status = "Extreme Fear"; color = "text-rose-600"; bg = "bg-rose-600"; }
  else if (score <= 45) { status = "Fear"; color = "text-rose-400"; bg = "bg-rose-400"; }
  else if (score <= 54) { status = "Neutral"; color = "text-amber-500"; bg = "bg-amber-500"; }
  else if (score <= 75) { status = "Greed"; color = "text-emerald-400"; bg = "bg-emerald-400"; }
  else { status = "Extreme Greed"; color = "text-emerald-600"; bg = "bg-emerald-600"; }

  // Restrict score
  const safeScore = Math.max(0, Math.min(100, score));

  return (
    <div className="bg-surface border border-outline/20 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col justify-between h-full group hover:border-outline/40 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
          <Gauge className="w-5 h-5 text-on-surface-variant" /> {label || "Market Sentiment"}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${bg} text-white shadow-sm`}>
          {safeScore}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative w-full max-w-[240px] h-4 bg-surface-container rounded-full overflow-visible mb-6">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} opacity-80`}></div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 -ml-2 w-4 h-8 bg-surface border-2 border-on-surface rounded-full shadow-lg transition-all duration-1000 ease-out z-10"
            style={{ left: `${safeScore}%` }}
          />
        </div>
        <h4 className={`text-3xl font-display font-black tracking-tight ${color} text-center`}>
          {status}
        </h4>
        <p className="text-on-surface-variant text-sm mt-3 text-center font-medium max-w-[200px] leading-relaxed">
          {score > 54 ? "시장에 과열 양상이 보입니다. 주의 깊은 접근이 필요합니다." : score < 46 ? "투자자들의 공포 심리가 짙습니다. 매수 기회일 수 있습니다." : "시장이 뚜렷한 방향성 없이 관망 중입니다."}
        </p>
      </div>
    </div>
  );
});
