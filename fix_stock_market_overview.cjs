const fs = require('fs');

let cardContent = fs.readFileSync('src/components/StockCard.tsx', 'utf8');
cardContent = cardContent.replace(
  'export const StockCard = ({ stock }: { stock?: StockData }) => {',
  'export const StockCard = ({ stock, onClick }: { stock?: StockData, onClick?: () => void }) => {'
);
cardContent = cardContent.replace(
  '<div className="card p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-outline/20 group cursor-pointer h-full">',
  '<div className="card p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-outline/20 group cursor-pointer h-full" onClick={onClick}>'
);
fs.writeFileSync('src/components/StockCard.tsx', cardContent);

let overviewContent = fs.readFileSync('src/components/StockMarketOverview.tsx', 'utf8');
overviewContent = overviewContent.replace(
  'export const StockMarketOverview = React.memo(() => {',
  'export const StockMarketOverview = React.memo(({ onSelectAsset }: { onSelectAsset?: (id: string) => void }) => {'
);

overviewContent = overviewContent.replace(
  '<StockCard key={stock.code} stock={stock} />',
  `{
    const stockMap: Record<string, string> = {
      "005930": "samsung",
      "000660": "hynix",
      "005380": "hyundai",
      "035420": "naver",
      "035720": "kakao"
    };
    return <StockCard key={stock.code} stock={stock} onClick={() => onSelectAsset && onSelectAsset(stockMap[stock.code] || "samsung")} />
  }`
);
fs.writeFileSync('src/components/StockMarketOverview.tsx', overviewContent);
