const fs = require('fs');

let useAsset = fs.readFileSync('src/hooks/useAssetData.ts', 'utf8');
useAsset = useAsset.replace(/catch \(err: unknown\) \{[\s\S]*?\}\);/, `catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError" && isMounted) {
          console.error("API Error:", err.message);
          setError(err.message);
          setData(null);
          setLoading(false);
        } else if (!(err instanceof Error) && isMounted) {
          setError(String(err));
          setData(null);
          setLoading(false);
        }
      }
    };`);
fs.writeFileSync('src/hooks/useAssetData.ts', useAsset);

let assetChart = fs.readFileSync('src/components/dashboard/AssetChart.tsx', 'utf8');
assetChart = assetChart.replace(/const bodyDelta = Math\.abs\(open - close\);/g, 'const bodyDelta = Math.abs(Number(open) - Number(close));');
assetChart = assetChart.replace(/const maxOC = Math\.max\(open, close\);/g, 'const maxOC = Math.max(Number(open), Number(close));');
assetChart = assetChart.replace(/const minOC = Math\.min\(open, close\);/g, 'const minOC = Math.min(Number(open), Number(close));');
assetChart = assetChart.replace(/y=\{maxOC \> open \? y \+ \(maxOC \- open\) \* pxPerPrice : y\}/g, 'y={maxOC > Number(open) ? Number(y) + (maxOC - Number(open)) * pxPerPrice : Number(y)}');
fs.writeFileSync('src/components/dashboard/AssetChart.tsx', assetChart);

