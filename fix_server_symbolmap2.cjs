const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const additional = `hyundai: { ticker: "005380", label: "현대차", shares: 211531506 },
        naver: { ticker: "035420", label: "NAVER", shares: 162408594 },
        kakao: { ticker: "035720", label: "카카오", shares: 446549221 }`;

content = content.replace('hyundai: { ticker: "005380", label: "현대차", shares: 211531506 }', additional);
fs.writeFileSync('server.ts', content);
