const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /const stocks = data\.result\.areas\[0\]\.datas\.map\(\(item: any\) => \(\{[\s\S]*?\}\)\);/;
const replacement = `
        const nameMap: Record<string, string> = {
          "005930": "삼성전자",
          "000660": "SK하이닉스",
          "005380": "현대차",
          "035420": "NAVER",
          "035720": "카카오"
        };
        const stocks = data.result.areas[0].datas.map((item: any) => ({
          code: item.cd,
          name: nameMap[item.cd] || item.nm,
          price: item.nv,
          prevPrice: item.pcv,
          change: item.cv,
          changeRate: item.cr * (item.nv >= item.pcv ? 1 : -1),
          volume: item.aq,
          tradingValue: item.aa
        }));
`;

content = content.replace(regex, replacement);
fs.writeFileSync('server.ts', content);
