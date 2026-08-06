const fs = require('fs');

function fix(file, typeName) {
  let content = fs.readFileSync(file, 'utf8');

  // Add toast import if missing
  if (!content.includes('import { toast }')) {
    content = content.replace(
      'import { useAssetData',
      'import { toast } from "../components/Toast";\nimport { useAssetData'
    );
  }

  // Update toggleFavorite
  const togglePattern = /const toggleFavorite = \(id: string\) => {[\s\S]*?setFavorites\(\(prev\) => {[\s\S]*?const updated = prev\.includes\(id\)[\s\S]*?\? prev\.filter\(\(f\) => f !== id\)[\s\S]*?: \[\.\.\.prev, id\];[\s\S]*?localStorage\.setItem\("crypto_favorites_v1", JSON\.stringify\(updated\)\);[\s\S]*?return updated;[\s\S]*?}\);[\s\S]*?};/m;

  const newToggle = `const toggleFavorite = (id: string) => {
    const isAdding = !favorites.includes(id);
    if (isAdding) {
      toast.success(\`\${id.toUpperCase()}이(가) 관심 자산에 추가되었습니다.\`);
    } else {
      toast.info(\`\${id.toUpperCase()}이(가) 관심 자산에서 제거되었습니다.\`);
    }
    
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem(\`\${typeName}_favorites_v1\`, JSON.stringify(updated));
      return updated;
    });
  };`;

  content = content.replace(togglePattern, newToggle);

  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx', 'crypto');
fix('src/pages/StockDashboard.tsx', 'stock');
