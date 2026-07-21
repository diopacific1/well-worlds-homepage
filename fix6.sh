sed -i '1259c\
                      <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">\
                        <BarChart2 className="w-3.5 h-3.5 text-primary" />\
                        자산 총 가치 대비 현황 비교\
                      </h4>\
                      <div className="w-full h-24 relative mt-1">\
                        {mounted && (\
                          <ResponsiveContainer width="100%" height="100%">\
                            <BarChart \
                              data={[\
                                { name: "투자 원금", 금액: Math.round(totalInvested), color: "#94A3B8" },\
                                { name: "평가 총액", 금액: Math.round(currentValue), color: profitLoss >= 0 ? "#E13030" : "#1261C4" }\
                              ]} \
                              layout="vertical" \
                              margin={{ left: 0, right: 15, top: 5, bottom: 5 }}\
                            >\
                              <XAxis type="number" hide />\
                              <YAxis dataKey="name" type="category" fontSize={11} stroke="#64748B" width={64} axisLine={false} tickLine={false} />\
                              <Bar dataKey="금액" radius={[0, 6, 6, 0]} barSize={12}>\
                                <Cell fill="#94A3B8" />\
                                <Cell fill={profitLoss >= 0 ? "#E13030" : "#1261C4"} />\
                              </Bar>\
                            </BarChart>\
                          </ResponsiveContainer>\
                        )}\
                      </div>\
                    </div>\
                    <div className="flex justify-between items-center pt-3 border-t border-outline/10 text-[11px] font-mono text-on-surface-variant">\
                      <span>매수가: ₩{Math.round(currentBuyPrice).toLocaleString()} 원</span>\
                      <span className="font-bold text-on-surface">잔고: {currentQuantity.toLocaleString()} {coin.symbol}</span>\
                    </div>\
                  </div>\
                </div>\
' src/pages/CryptoDashboard.tsx
