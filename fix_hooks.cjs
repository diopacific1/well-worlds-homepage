const fs = require('fs');

function refactorHooks(file, storageKey) {
  let content = fs.readFileSync(file, 'utf8');

  // Add hook import
  if (!content.includes('import { useAssetFavorites }')) {
    content = content.replace(
      'import { useAssetData } from "../hooks/useAssetData";',
      'import { useAssetData } from "../hooks/useAssetData";\nimport { useAssetFavorites } from "../hooks/useAssetFavorites";'
    );
  }

  // Find the start of the favorites state
  const stateStart = content.indexOf('const [favorites, setFavorites] = useState<string[]>');
  
  if (stateStart !== -1) {
    // We need to replace up to the end of toggleFavorite
    const hookStr = `const { favorites, toggleFavorite } = useAssetFavorites("${storageKey}");`;
    
    // Use regex to remove the old state and toggle function
    const oldStateAndToggleRegex = /\/\/\s*Watchlist\s*\(Favorites\)\s*state\s*const \[favorites, setFavorites\][\s\S]*?\}, \[\]\);/m;
    
    content = content.replace(oldStateAndToggleRegex, `// Watchlist (Favorites) state\n  ${hookStr}`);
  }

  fs.writeFileSync(file, content);
}

refactorHooks('src/pages/CryptoDashboard.tsx', 'crypto_favorites_v1');
refactorHooks('src/pages/StockDashboard.tsx', 'stock_favorites_v1');
