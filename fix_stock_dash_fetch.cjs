const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

const mockFetchBlockRegex = /const fetchData = async \(\) => \{[\s\S]*?fetchData\(\);/m;

const realFetchCode = `    const fetchController = new AbortController();
    fetch(\`/api/stock?id=\${activeCoinId}&timeframe=\${timeframe}\`, {
      signal: fetchController.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API Error:", data.error);
          setCryptoData(null);
        } else {
          sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }));
          setCryptoData(data);
        }
        setLoadingCrypto(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setCryptoData(null);
          setLoadingCrypto(false);
        }
      });
      return () => fetchController.abort();`;

content = content.replace(mockFetchBlockRegex, realFetchCode);

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
