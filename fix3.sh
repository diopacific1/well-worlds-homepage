sed -i '1218,1225c\
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
' src/pages/CryptoDashboard.tsx
