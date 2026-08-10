const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace('price: cryptoData?.price || "$0.00"', 'price: cryptoData?.price || coin.price');
content = content.replace('trend: cryptoData?.trend || "0.00%"', 'trend: cryptoData?.trend || coin.trend');
content = content.replace('volLow: cryptoData?.low24h || "-"', 'volLow: cryptoData?.low24h || coin.volLow');
content = content.replace('volHigh: cryptoData?.high24h || "-"', 'volHigh: cryptoData?.high24h || coin.volHigh');
content = content.replace('marketCap: cryptoData?.marketCap || "-"', 'marketCap: cryptoData?.marketCap || coin.marketCap');
content = content.replace('volume: cryptoData?.volume || "-"', 'volume: cryptoData?.volume || coin.volume');
content = content.replace('targetPrice: cryptoData?.ma50 || "-"', 'targetPrice: cryptoData?.ma50 || coin.targetPrice');

// There is also a place where it assigns coin = MOCK_STOCKS[activeCoinId] || { ... }
// Wait, `coin` object is defined exactly as:
// const coin = MOCK_STOCKS[activeCoinId] || { ... }
// But wait! If `MOCK_STOCKS[activeCoinId]` exists, it uses `MOCK_STOCKS[activeCoinId]`. 
// So `coin` will have the correct price if it's samsung/hynix/hyundai.
// But wait, the `value={formatKRW(String(cryptoData?.price || coin.price))}` handles it anyway.

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
