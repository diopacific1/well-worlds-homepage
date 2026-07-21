sed -i '1175,1369c\
              {/* Portfolio ROI Analysis Simulator */}\
              <div className="card p-6 md:p-8 relative flex flex-col border border-primary/10 overflow-hidden">\
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>\
                \
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-outline/10">\
                  <div>\
                    <h3 className="text-xl md:text-2xl font-display font-bold text-on-surface flex items-center gap-2">\
                      <TrendingUp className="w-5 h-5 text-primary" />\
                      내 투자 자산 실시간 분석 센터\
                    </h3>\
                    <p className="text-xs text-on-surface-variant font-medium mt-1">\
                      현재 선택된 <span className="font-bold text-primary">{coin.name} ({coin.symbol})</span> 실시간 수치에 기반해 수익률을 즉각 분석합니다.\
                    </p>\
                  </div>\
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-mono font-bold tracking-wider">\
                    ROI ESTIMATOR v2.5\
                  </span>\
                </div>\
\
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">\
                  {/* Left Controls */}\
                  <div className="space-y-5 flex flex-col justify-center">\
                    <div>\
                      <label htmlFor="buyPriceInput" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">\
                        평균 매수 단가 (₩)\
                      </label>\
                      <div className="relative">\
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-on-surface-variant">₩</span>\
                        <input\
                          id="buyPriceInput"\
                          type="number"\
                          value={currentBuyPrice || ""}\
                          onChange={(e) => handleBuyPriceChange(parseFloat(e.target.value) || 0)}\
                          className="w-full input-field !pl-9 font-mono font-bold"\
                          placeholder="매수 가격 입력 (원)"\
                          step="any"\
                        />\
                      </div>\
                      <div className="flex justify-between text-[11px] text-on-surface-variant mt-1.5 px-1 flex-wrap gap-2">\
                        <span>현재 시세: ₩{Math.round(currentPriceKRW).toLocaleString()}</span>\
                        <button \
                          type="button"\
                          onClick={() => handleBuyPriceChange(Math.round(currentPriceKRW * 0.95))}\
                          className="text-primary hover:underline font-bold"\
                        >\
                          현재 시세 -5% 자동 대입\
                        </button>\
                      </div>\
                    </div>\
                    <div>\
                      <label htmlFor="quantityInput" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">\
                        보유 수량 ({coin.symbol})\
                      </label>\
                      <div className="relative">\
                        <input\
                          id="quantityInput"\
                          type="number"\
                          value={currentQuantity || ""}\
                          onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}\
                          className="w-full input-field font-mono font-bold"\
                          placeholder="보유 가상자산 수량 입력"\
                          step="any"\
                        />\
                      </div>\
                      <div className="flex justify-between text-[11px] text-on-surface-variant mt-2 px-1">\
                        <span>수량 빠른 조절</span>\
                        <div className="flex gap-1.5">\
                          <button type="button" onClick={() => handleQuantityChange(0)} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">0</button>\
                          <button type="button" onClick={() => handleQuantityChange(Math.max(0, currentQuantity * 0.5))} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">½</button>\
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity + 0.1)} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">+0.1</button>\
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity + 1)} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">+1</button>\
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity * 2)} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">2x</button>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                  \
                  {/* Right Asset comparison visualizer */}\
                  <div className="bg-surface-dim/40 rounded-2xl p-5 border border-outline/10 flex flex-col justify-between">\
                    <div>\
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
\
                {/* Bento dynamic stats indicators */}\
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">\
                  <div className="bg-surface border border-outline/10 p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">\
                    <div className="absolute top-0 right-0 w-16 h-16 bg-surface-dim/50 rounded-full blur-xl pointer-events-none group-hover:bg-primary/5 transition-colors"></div>\
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">\
                      총 매수 금액 (원금)\
                    </span>\
                    <h4 className="text-xl md:text-2xl font-mono font-bold text-on-surface mt-3 tracking-tight">\
                      ₩{Math.round(totalInvested).toLocaleString()} <span className="text-sm font-sans font-medium text-on-surface-variant">원</span>\
                    </h4>\
                  </div>\
                  <div className="bg-surface border border-outline/10 p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">\
                    <div className="absolute top-0 right-0 w-16 h-16 bg-surface-dim/50 rounded-full blur-xl pointer-events-none group-hover:bg-primary/5 transition-colors"></div>\
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">\
                      현재 평가 금액\
                    </span>\
                    <h4 className="text-xl md:text-2xl font-mono font-bold text-on-surface mt-3 tracking-tight">\
                      ₩{Math.round(currentValue).toLocaleString()} <span className="text-sm font-sans font-medium text-on-surface-variant">원</span>\
                    </h4>\
                  </div>\
                  <div className={`border p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden transition-colors ${profitLoss >= 0 ? "bg-[#E13030]/5 border-[#E13030]/20 hover:border-[#E13030]/40" : "bg-[#1261C4]/5 border-[#1261C4]/20 hover:border-[#1261C4]/40"}`}>\
                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl pointer-events-none ${profitLoss >= 0 ? "bg-[#E13030]/10" : "bg-[#1261C4]/10"}`}></div>\
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">\
                      평가 손익 (Net Profit)\
                    </span>\
                    <h4 className={`text-xl md:text-2xl font-mono font-bold mt-3 tracking-tight ${profitLoss >= 0 ? "text-[#E13030]" : "text-[#1261C4]"}`}>\
                      {profitLoss > 0 ? "+" : ""}₩{Math.round(profitLoss).toLocaleString()} <span className={`text-sm font-sans font-medium ${profitLoss >= 0 ? "text-[#E13030]/70" : "text-[#1261C4]/70"}`}>원</span>\
                    </h4>\
                  </div>\
                  <div className={`border p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden transition-colors ${roi >= 0 ? "bg-gradient-to-br from-[#E13030]/10 to-transparent border-[#E13030]/30 hover:border-[#E13030]/50" : "bg-gradient-to-br from-[#1261C4]/10 to-transparent border-[#1261C4]/30 hover:border-[#1261C4]/50"}`}>\
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">\
                      수익률 (ROI)\
                    </span>\
                    <h4 className={`text-3xl md:text-4xl font-display font-black mt-2 flex items-center gap-1 tracking-tighter ${roi >= 0 ? "text-[#E13030]" : "text-[#1261C4]"}`}>\
                      {roi > 0 ? "+" : ""}{roi.toFixed(2)}<span className="text-xl">%</span>\
                    </h4>\
                  </div>\
                </div>\
              </div>\
' src/pages/CryptoDashboard.tsx
