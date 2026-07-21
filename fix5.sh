sed -i '1217,1229c\
                        <button\
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
' src/pages/CryptoDashboard.tsx
