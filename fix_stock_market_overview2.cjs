const fs = require('fs');

let content = fs.readFileSync('src/components/StockMarketOverview.tsx', 'utf8');

content = content.replace(
  `stocks.map(stock => (
            {
    const stockMap: Record<string, string> = {
      "005930": "samsung",
      "000660": "hynix",
      "005380": "hyundai",
      "035420": "naver",
      "035720": "kakao"
    };
    return <StockCard key={stock.code} stock={stock} onClick={() => onSelectAsset && onSelectAsset(stockMap[stock.code] || "samsung")} />
  }
          ))`,
  `stocks.map(stock => {
    const stockMap: Record<string, string> = {
      "005930": "samsung",
      "000660": "hynix",
      "005380": "hyundai",
      "035420": "naver",
      "035720": "kakao"
    };
    return <StockCard key={stock.code} stock={stock} onClick={() => onSelectAsset && onSelectAsset(stockMap[stock.code] || "samsung")} />
  })`
);

fs.writeFileSync('src/components/StockMarketOverview.tsx', content);
