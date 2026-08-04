const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('StockDashboard')) {
  content = content.replace(
    'const CryptoDashboard = lazy(() => import("./pages/CryptoDashboard"));',
    'const CryptoDashboard = lazy(() => import("./pages/CryptoDashboard"));\nconst StockDashboard = lazy(() => import("./pages/StockDashboard"));'
  );
  
  content = content.replace(
    '<Route path="crypto" element=',
    '<Route path="stock" element={\n            <Suspense fallback={<PageLoader />}>\n              <StockDashboard />\n            </Suspense>\n          } />\n          <Route path="crypto" element='
  );
  
  fs.writeFileSync('src/App.tsx', content);
}
