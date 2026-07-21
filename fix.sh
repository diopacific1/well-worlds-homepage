sed -i '734,867c\
  const sentimentScoreVal = cryptoData?.sentimentScore || 68;\
  const sentimentColorClass = sentimentScoreVal >= 50 ? "text-[#E13030]" : "text-[#1261C4]";\
\
  return (\
    <PriceProvider>\
      <Helmet>\
        <title>{coin.name} ({coin.symbol}) 실시간 시세 및 AI 지표 분석 | 알고리즘 트레이더</title>\
        <meta name="description" content={`${coin.name}의 실시간 가격, 변동성, RSI, MAs 등 기술적 지표를 활용한 알고리즘 트레이딩 전문 리포트`} />\
      </Helmet>\
      <main className="w-full flex flex-col pb-20">\
        <PriceTicker />\
        <div className="p-4 lg:p-6 space-y-8 animate-in fade-in duration-700 max-w-[1280px] mx-auto w-full mt-4">\
          <MarketOverview />\
\
          <div className="card p-5 md:p-6 flex flex-col gap-5 transition-none">\
            <form\
              onSubmit={handleSearch}\
              className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 w-full"\
              aria-label="가상자산 검색"\
            >\
              <div className="flex items-center gap-4">\
                {coin.image ? (\
                  <img\
                    src={coin.image}\
                    alt={`${coin.name} 로고`}\
                    loading="lazy"\
                    decoding="async"\
                    fetchPriority="high"\
                    className="w-12 h-12 rounded-full object-contain bg-surface p-1 border border-outline/20 shadow-sm content-visibility-auto"\
                  />\
                ) : (\
                  <div\
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${coin.color} flex items-center justify-center font-bold text-white shadow-sm text-sm p-1`}\
                  >\
                    {coin.symbol}\
                  </div>\
                )}\
                <div className="flex flex-col">\
                  <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-on-surface uppercase flex items-center gap-3">\
                    {coin.name}{" "}\
                    <span className="text-primary font-mono text-xl md:text-2xl opacity-80 mt-1">\
                      / USD\
                    </span>\
                  </h1>\
                </div>\
              </div>\
\
              <div className="flex-1 max-w-2xl relative w-full flex flex-col gap-3" ref={searchInputRef}>\
                <div className="relative">\
                  <label htmlFor="cryptoSearch" className="sr-only">\
                    검색어 입력\
                  </label>\
                  <Search\
                    className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"\
                    aria-hidden="true"\
                  />\
                  <input\
                    id="cryptoSearch"\
                    type="text"\
                    value={searchTerm}\
                    onFocus={() => setShowSearchDropdown(true)}\
                    onChange={(e) => {\
                      setSearchTerm(e.target.value);\
                      setShowSearchDropdown(true);\
                    }}\
                    placeholder="시장, 자산 검색 (예: 리플, 도지코인)"\
                    className="w-full input-field !pl-12 !pr-24 font-mono uppercase"\
                    aria-label="시장, 자산 검색"\
                    autoComplete="off"\
                  />\
                  <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none opacity-50">\
                    <kbd className="px-2 py-1 bg-surface-dim rounded text-[10px] font-mono border border-outline/10 text-on-surface-variant">/</kbd>\
                  </div>\
                  <button\
                    type="submit"\
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-bold hover:bg-primary/20 transition-colors"\
                    aria-label="검색 실행"\
                  >\
                    검색\
                  </button>\
                  \
                  {showSearchDropdown && searchResults.length > 0 && (\
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-outline/20 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">\
                      {searchResults.map((id) => (\
                        <button\
                          key={id}\
                          type="button"\
                          onClick={() => {\
                            setActiveCoinId(id);\
                            setSearchTerm("");\
                            setShowSearchDropdown(false);\
                          }}\
                          className="w-full text-left px-4 py-3 hover:bg-surface-dim transition-colors flex items-center gap-3 border-b border-outline/5 last:border-b-0"\
                        >\
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-[10px] font-bold uppercase overflow-hidden">\
                            {id.substring(0, 3)}\
                          </div>\
                          <span className="font-display font-bold text-on-surface uppercase">{id}</span>\
                        </button>\
                      ))}\
                    </div>\
                  )}\
                </div>\
              </div>\
            </form>\
\
            <div className="flex items-center justify-between border-t border-outline/10 pt-4 mt-1">\
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">\
                <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 whitespace-nowrap mr-2">\
                  <Star className="w-3.5 h-3.5" /> 관심 자산\
                </span>\
                {favorites.length > 0 ? (\
                  favorites.map(id => (\
                    <button\
                      key={id}\
                      onClick={() => setActiveCoinId(id)}\
                      className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold whitespace-nowrap transition-colors border ${activeCoinId === id ? "bg-primary text-white border-primary" : "bg-surface-dim border-outline/10 text-on-surface hover:bg-surface-container"}`}\
                    >\
                      {id.toUpperCase()}\
                    </button>\
                  ))\
                ) : (\
                  <span className="text-[11px] text-on-surface-variant/50 font-mono">별 아이콘을 눌러 추가하세요</span>\
                )}\
              </div>\
              <button\
                onClick={() => toggleFavorite(activeCoinId)}\
                className={`ml-4 flex-shrink-0 p-2 rounded-full transition-colors border ${favorites.includes(activeCoinId) ? "bg-amber-400/10 border-amber-400/30 text-amber-500" : "bg-surface-dim border-outline/10 text-on-surface-variant hover:text-on-surface hover:bg-surface-container"}`}\
                title={favorites.includes(activeCoinId) ? "관심 자산에서 제거" : "관심 자산에 추가"}\
              >\
                <Star className={`w-4 h-4 ${favorites.includes(activeCoinId) ? "fill-current" : ""}`} />\
              </button>\
            </div>\
          </div>\
' src/pages/CryptoDashboard.tsx
