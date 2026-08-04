const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(/const basePriceStr = stockInfo\?\.price\.replace\(\/\[\^0-9\]\/g, ''\) \|\| "50000";/g, 'const basePriceStr = String(stockInfo?.price || "50000").replace(/[^0-9]/g, "");');

content = content.replace(/id: activeCoinId,/g, '');

const fallbackCoinRegex = /const coin = MOCK_STOCKS\[activeCoinId\] \|\| \{/g;
content = content.replace(fallbackCoinRegex, 'const coin = MOCK_STOCKS[activeCoinId] || {\n    image: "",');

content = content.replace(/const currentPriceKRW = currentPriceKRW \* USD_TO_KRW;/g, '');

content = content.replace(/formatKRWMacro\(cryptoData\?\.marketCap \|\| coin\.marketCap\)/g, 'formatKRWMacro(String(cryptoData?.marketCap || coin.marketCap))');
content = content.replace(/formatKRWMacro\(cryptoData\?\.volume \|\| coin\.volume\)/g, 'formatKRWMacro(String(cryptoData?.volume || coin.volume))');
content = content.replace(/formatKRW\(cryptoData\?\.price \|\| coin\.price\)/g, 'formatKRW(String(cryptoData?.price || coin.price))');
content = content.replace(/formatKRW\(cryptoData\?\.low24h \|\| coin\.volLow\)/g, 'formatKRW(String(cryptoData?.low24h || coin.volLow))');
content = content.replace(/formatKRW\(cryptoData\?\.high24h \|\| coin\.volHigh\)/g, 'formatKRW(String(cryptoData?.high24h || coin.volHigh))');
content = content.replace(/formatKRW\(cryptoData\?\.ma200 \|\| coin\.targetPrice\)/g, 'formatKRW(String(cryptoData?.ma200 || coin.targetPrice))');

// Wait, the formatters take `val: string | number | undefined`, so why error?
// Oh, the error was: "Argument of type 'string | number' is not assignable to parameter of type 'string'" 
// This might be in `Number.parseFloat` or somewhere, but I changed the formatter signature.

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
