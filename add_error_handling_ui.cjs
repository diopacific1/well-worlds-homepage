const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    '<DashboardSkeleton />',
    '{loadingCrypto && <DashboardSkeleton />}\n            {fetchError && (\n              <div className="absolute inset-0 z-20 bg-surface/80 backdrop-blur-sm flex justify-center pt-32 p-6">\n                <div className="bg-surface border border-red-500/30 p-6 rounded-2xl shadow-xl max-w-sm h-fit text-center">\n                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">\n                    <Activity className="w-6 h-6" />\n                  </div>\n                  <h3 className="text-on-surface font-bold text-lg mb-2">데이터를 불러오지 못했습니다</h3>\n                  <p className="text-on-surface-variant text-sm mb-6">{fetchError}</p>\n                  <button onClick={() => setRefreshCount(r => r + 1)} className="px-6 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition-colors">\n                    다시 시도\n                  </button>\n                </div>\n              </div>\n            )}'
  );

  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');

