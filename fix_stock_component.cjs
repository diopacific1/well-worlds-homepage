const fs = require('fs');

let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

const anchor = '  // Keyboard Shortcuts';
const replacement = `
export default function StockDashboard() {
  const [activeCoinId, setActiveCoinId] = useState("samsung");

  // Watchlist (Favorites) state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("crypto_favorites_v1");
      return saved ? JSON.parse(saved) : ["samsung", "hynix", "hyundai"];
    } catch {
      return ["samsung", "hynix", "hyundai"];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("crypto_favorites_v1", JSON.stringify(updated));
      return updated;
    });
  };

  // Keyboard Shortcuts`;

content = content.replace(anchor, replacement);
fs.writeFileSync('src/pages/StockDashboard.tsx', content);

