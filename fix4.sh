sed -i '1264,1285c\
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
' src/pages/CryptoDashboard.tsx
