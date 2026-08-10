const fs = require('fs');

// 1. StockCard
let stockCard = fs.readFileSync('src/components/StockCard.tsx', 'utf8');
stockCard = stockCard.replace(/text-kr-up/g, 'text-[#E13030]');
stockCard = stockCard.replace(/text-kr-down/g, 'text-[#1261C4]');
stockCard = stockCard.replace(/bg-kr-up\/10/g, 'bg-[#E13030]/10');
stockCard = stockCard.replace(/bg-kr-down\/10/g, 'bg-[#1261C4]/10');
fs.writeFileSync('src/components/StockCard.tsx', stockCard);

// 2. StockPriceTicker
let stockTicker = fs.readFileSync('src/components/StockPriceTicker.tsx', 'utf8');
stockTicker = stockTicker.replace(/text-kr-up/g, 'text-[#E13030]');
stockTicker = stockTicker.replace(/text-kr-down/g, 'text-[#1261C4]');
stockTicker = stockTicker.replace(/bg-kr-up\/10/g, 'bg-[#E13030]/10');
stockTicker = stockTicker.replace(/bg-kr-down\/10/g, 'bg-[#1261C4]/10');
fs.writeFileSync('src/components/StockPriceTicker.tsx', stockTicker);

// 3. StockMarketOverview
let stockOverview = fs.readFileSync('src/components/StockMarketOverview.tsx', 'utf8');
stockOverview = stockOverview.replace(
  'grid grid-cols-2 lg:grid-cols-5 gap-4',
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'
);
fs.writeFileSync('src/components/StockMarketOverview.tsx', stockOverview);

// 4. useStockMarket
let useStock = fs.readFileSync('src/hooks/useStockMarket.ts', 'utf8');
useStock = useStock.replace('intervalId = setInterval(fetchMarketData, 10000);', 'intervalId = setInterval(fetchMarketData, 2000);');
fs.writeFileSync('src/hooks/useStockMarket.ts', useStock);
