const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/SharedCards.tsx', 'utf8');

if (!content.includes('import React, { memo } from "react";') && !content.includes('import { memo }')) {
  content = 'import { memo } from "react";\n' + content;
  content = content.replace(/export function MetricCard/g, 'export const MetricCard = memo(function MetricCard');
  content = content.replace(/export function IndicatorCard/g, 'export const IndicatorCard = memo(function IndicatorCard');
  content = content.replace(/export function InsightItem/g, 'export const InsightItem = memo(function InsightItem');
  content = content.replace(/export function LiveBadge/g, 'export const LiveBadge = memo(function LiveBadge');

  // Fix the closing brackets for memo
  // MetricCard ends before IndicatorCard
  content = content.replace(/}\n\nexport const IndicatorCard/, '});\n\nexport const IndicatorCard');
  // IndicatorCard ends before InsightItem
  content = content.replace(/}\n\nexport const InsightItem/, '});\n\nexport const InsightItem');
  // InsightItem ends before LiveBadge
  content = content.replace(/}\n\nexport const LiveBadge/, '});\n\nexport const LiveBadge');
  // LiveBadge ends at end of file
  content = content.replace(/}\n$/, '});\n');
  
  fs.writeFileSync('src/components/dashboard/SharedCards.tsx', content);
}
