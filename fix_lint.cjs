const fs = require('fs');

function fixServer() {
  let content = fs.readFileSync('server.ts', 'utf8');
  content = content.replace(
    "const id = (req.query.id || 'samsung').toLowerCase().trim();",
    "const id = ((req.query.id as string) || 'samsung').toLowerCase().trim();"
  );
  content = content.replace(
    "const timeframe = (req.query.timeframe || '1D').toUpperCase().trim();",
    "const timeframe = ((req.query.timeframe as string) || '1D').toUpperCase().trim();"
  );
  fs.writeFileSync('server.ts', content);
}

function fixDashboard(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    "${algoAction.color} ${algoAction.border}",
    "${algoAction.color} border-current"
  );
  fs.writeFileSync(file, content);
}

fixServer();
fixDashboard('src/pages/StockDashboard.tsx');
fixDashboard('src/pages/CryptoDashboard.tsx');
