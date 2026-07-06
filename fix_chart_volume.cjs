const fs = require('fs');
let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

const target1 = `                        <YAxis 
                          domain={chartDomain}
                          tickFormatter={(v) => \`₩\${Math.round(v).toLocaleString()}\`}
                          stroke="#1E293B" 
                          fontSize={11} 
                          fontWeight={600}
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          dx={5}
                        />`;

const replace1 = `                        <YAxis 
                          yAxisId="price"
                          domain={chartDomain}
                          tickFormatter={(v) => \`₩\${Math.round(v).toLocaleString()}\`}
                          stroke="#1E293B" 
                          fontSize={11} 
                          fontWeight={600}
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          dx={5}
                        />
                        <YAxis
                          yAxisId="volume"
                          orientation="left"
                          hide
                          domain={[0, (dataMax: number) => dataMax * 4]}
                        />`;

code = code.replace(target1, replace1);

const target2 = `                        <Bar
                          dataKey="bodyRange"
                          shape={<CandlestickShape />}
                        />`;

const replace2 = `                        <Bar
                          dataKey="bodyRange"
                          yAxisId="price"
                          shape={<CandlestickShape />}
                        />
                        <Bar
                          dataKey="volume"
                          yAxisId="volume"
                          fill="#94A3B8"
                          opacity={0.25}
                          barSize={12}
                        />`;

code = code.replace(target2, replace2);

const target3 = `                        {/* 5-Period Moving Average line */}
                        <Line
                          type="monotone"
                          dataKey="ma5"`;
const replace3 = `                        {/* 5-Period Moving Average line */}
                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="ma5"`;

code = code.replace(target3, replace3);

const target4 = `                        {/* 10-Period Moving Average line */}
                        <Line
                          type="monotone"
                          dataKey="ma10"`;
const replace4 = `                        {/* 10-Period Moving Average line */}
                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="ma10"`;

code = code.replace(target4, replace4);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
console.log('Fixed chart volume');
