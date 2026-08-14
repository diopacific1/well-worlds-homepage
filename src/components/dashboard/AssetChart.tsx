import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface CandlestickProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: Record<string, any>;
}

const CandlestickShape = (props: CandlestickProps) => {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  if (!payload) return null;
  const { open, high, low, close, isUp } = payload;

  const strokeColor = isUp ? "var(--color-kr-up)" : "var(--color-kr-down)";
  const fillColor = isUp ? "var(--color-kr-up)" : "var(--color-kr-down)";

  const bodyDelta = Math.abs(Number(open) - Number(close));
  const pxPerPrice = bodyDelta > 0 ? height / bodyDelta : 1;

  const maxOC = Math.max(Number(open), Number(close));
  const minOC = Math.min(Number(open), Number(close));

  const highY = y - (high - maxOC) * pxPerPrice;
  const lowY = y + height + (minOC - low) * pxPerPrice;

  const centerX = x + width / 2;

  return (
    <g>
      <line
        x1={centerX}
        y1={highY}
        x2={centerX}
        y2={lowY}
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={Math.max(height, 1)}
        fill={fillColor}
        stroke={strokeColor}
      />
    </g>
  );
};

interface AssetChartProps {
  data: Array<Record<string, any>>;
  domain: [number, number];
  timeframe: string;
  marketType?: "crypto" | "stock";
}

export default function AssetChart({ data, domain, timeframe, marketType = "crypto" }: AssetChartProps) {
  const marketName = marketType === "crypto" ? "업비트형" : "한국형";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--color-chart-grid)"
        />
        <XAxis
          dataKey="time"
          stroke="var(--color-chart-text)"
          fontSize={11}
          fontWeight={600}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          yAxisId="price"
          domain={domain}
          tickFormatter={(v) => `₩${Math.round(v).toLocaleString()}`}
          stroke="var(--color-chart-text)"
          fontSize={11}
          fontWeight={600}
          orientation="right"
          axisLine={false}
          tickLine={false}
          dx={5}
        />
        <YAxis
          yAxisId="volume"
          orientation="left"
          hide
          domain={[0, (dataMax: number) => dataMax * 5]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const item = payload[0].payload;
              const isUp = item.isUp;
              const formatPrice = (v: number) => `₩${Math.round(v).toLocaleString()} 원`;
              const timeframeLabel =
                timeframe === "1H"
                  ? "시간봉"
                  : timeframe === "1D"
                    ? "일봉"
                    : "주봉";
              return (
                <div className="bg-tooltip-bg/98 text-white p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[210px]">
                  <div className="text-[11px] font-bold text-slate-400 border-b border-white/10 pb-1 mb-1.5 flex justify-between items-center">
                    <span>{item.time}</span>
                    <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">
                      {marketName} {timeframeLabel}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">시가 (Open)</span>
                    <span className="font-bold text-slate-200">
                      {formatPrice(item.open)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">고가 (High)</span>
                    <span className="font-bold text-kr-up">
                      {formatPrice(item.high)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">저가 (Low)</span>
                    <span className="font-bold text-kr-down">
                      {formatPrice(item.low)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-white/10 pt-1.5 mt-1.5 flex-wrap">
                    <span className="text-slate-400 font-sans">
                      종가 (Close)
                    </span>
                    <span
                      className={`font-bold ${isUp ? "text-kr-up" : "text-kr-down"}`}
                    >
                      {formatPrice(item.close)} {isUp ? "▲ 상승" : "▼ 하락"}
                    </span>
                  </div>
                  {item.ma5 && (
                    <div className="flex justify-between gap-4 text-[10px] text-slate-300">
                      <span className="flex items-center gap-1 font-sans">
                        <span className="inline-block w-2 h-2 rounded-full bg-ma5" />
                        5선 이평선
                      </span>
                      <span className="font-bold">
                        {formatPrice(item.ma5)}
                      </span>
                    </div>
                  )}
                  {item.ma10 && (
                    <div className="flex justify-between gap-4 text-[10px] text-slate-300">
                      <span className="flex items-center gap-1 font-sans">
                        <span className="inline-block w-2 h-2 rounded-full bg-ma10" />
                        10선 이평선
                      </span>
                      <span className="font-bold">
                        {formatPrice(item.ma10)}
                      </span>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="bodyRange"
          yAxisId="price"
          shape={<CandlestickShape />}
        />
        <Bar
          dataKey="volume"
          yAxisId="volume"
          fill="#94A3B8"
          opacity={0.25}
          barSize={12}
        />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="ma5"
          stroke="var(--color-ma5)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4 }}
          name="5선"
        />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="ma10"
          stroke="var(--color-ma10)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4 }}
          name="10선"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
