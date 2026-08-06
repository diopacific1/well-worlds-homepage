const fs = require('fs');

function fix(file, typeName) {
  let content = fs.readFileSync(file, 'utf8');

  const togglePattern = /const toggleFavorite = useCallback[\s\S]*?}, \[\]\);/m;

  const newToggle = `const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const isAdding = !prev.includes(id);
      const updated = isAdding
        ? [...prev, id]
        : prev.filter((f) => f !== id);
        
      localStorage.setItem(\`\${typeName}_favorites_v1\`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Sync toasts via useEffect to avoid strict mode double invokes
  // Wait, no, click events aren't double invoked in strict mode. Only render, effects, and state updaters are!
  // So if we just use a normal function, it's fine.
  `;
  
  const normalFunc = `const toggleFavorite = useCallback((id: string, currentFavorites: string[]) => {
    const isAdding = !currentFavorites.includes(id);
    if (isAdding) {
      toast.success(\`\${id.toUpperCase()}이(가) 관심 자산에 추가되었습니다.\`);
    } else {
      toast.info(\`\${id.toUpperCase()}이(가) 관심 자산에서 제거되었습니다.\`);
    }
    
    setFavorites((prev) => {
      const updated = isAdding
        ? [...prev, id]
        : prev.filter((f) => f !== id);
      localStorage.setItem(\`\${typeName}_favorites_v1\`, JSON.stringify(updated));
      return updated;
    });
  }, []);`;

  content = content.replace(togglePattern, normalFunc);
  
  // Now I need to update the onClick to pass favorites
  content = content.replace(/onToggleFavorite=\{toggleFavorite\}/g, 'onToggleFavorite={(id) => toggleFavorite(id, favorites)}');

  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx', 'crypto');
fix('src/pages/StockDashboard.tsx', 'stock');
