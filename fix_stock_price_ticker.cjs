const fs = require('fs');

let content = fs.readFileSync('src/components/StockPriceTicker.tsx', 'utf8');

const nameMap = {
  '005930': '삼성전자',
  '000660': 'SK하이닉스',
  '005380': '현대차',
  '035420': 'NAVER',
  '035720': '카카오'
};

content = content.replace(
  `    if (stocks.length === 0) {
      return codes.map(code => (
        <div key={code} className="flex items-center gap-2 text-sm font-mono text-on-surface-variant mx-4">
           <span>로딩중...</span>
        </div>
      ));
    }`,
  `    if (stocks.length === 0) {
      const nameMap: Record<string, string> = {
        '005930': '삼성전자',
        '000660': 'SK하이닉스',
        '005380': '현대차',
        '035420': 'NAVER',
        '035720': '카카오'
      };
      return codes.map(code => (
        <div key={code} className="flex items-center gap-2 text-sm font-mono text-on-surface-variant mx-4">
           <span className="font-bold">{nameMap[code]}</span>
           <span>로딩중...</span>
        </div>
      ));
    }`
);

fs.writeFileSync('src/components/StockPriceTicker.tsx', content);
