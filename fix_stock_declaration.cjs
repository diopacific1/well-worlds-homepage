const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// The `coin` variable was moved or referenced before definition.
// Wait, I replaced `cryptoData?.price || "$0.00"` with `cryptoData?.price || coin.price` INSIDE the `coin` definition.
// Ah, `const coin = MOCK_STOCKS[activeCoinId] || { ... }`
// So we can't reference `coin` inside its own definition.
// It should reference MOCK_STOCKS[activeCoinId] or default values.

// Let's replace the MOCK_STOCKS fallback object.
const matchStr = `const coin = MOCK_STOCKS[activeCoinId] || {`;
// find where it's used
content = content.replace(/price: cryptoData\?\.price \|\| coin\.price/g, 'price: cryptoData?.price || "0원"');
content = content.replace(/trend: cryptoData\?\.trend \|\| coin\.trend/g, 'trend: cryptoData?.trend || "0%"');
content = content.replace(/volLow: cryptoData\?\.low24h \|\| coin\.volLow/g, 'volLow: cryptoData?.low24h || "0"');
content = content.replace(/volHigh: cryptoData\?\.high24h \|\| coin\.volHigh/g, 'volHigh: cryptoData?.high24h || "0"');
content = content.replace(/marketCap: cryptoData\?\.marketCap \|\| coin\.marketCap/g, 'marketCap: cryptoData?.marketCap || "0"');
content = content.replace(/volume: cryptoData\?\.volume \|\| coin\.volume/g, 'volume: cryptoData?.volume || "0"');
content = content.replace(/targetPrice: cryptoData\?\.ma50 \|\| coin\.targetPrice/g, 'targetPrice: cryptoData?.ma50 || "0"');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
