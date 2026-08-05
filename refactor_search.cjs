const fs = require('fs');

function refactorDashboard(file, placeholder) {
  let content = fs.readFileSync(file, 'utf8');

  // Add AssetSearch import
  if (!content.includes('AssetSearch')) {
    content = content.replace(
      'import { MetricCard',
      'import { AssetSearch } from "../components/dashboard/AssetSearch";\nimport { MetricCard'
    );
  }

  // Find the exact block to replace: <div className="card p-5 md:p-6 ... </form> ... </div> </div>
  const searchStart = content.indexOf('<div className="card p-5 md:p-6 flex flex-col gap-5 transition-none">');
  
  if (searchStart === -1) {
     console.log('Search block not found in', file);
     return;
  }
  
  const metricsRowStart = content.indexOf('{/* Metrics Row */}');
  
  if (metricsRowStart === -1) {
     console.log('Metrics Row block not found in', file);
     return;
  }

  const replacement = `          <AssetSearch\n            activeCoinId={activeCoinId}\n            onSelectAsset={setActiveCoinId}\n            favorites={favorites}\n            onToggleFavorite={toggleFavorite}\n            searchMappings={SEARCH_MAPPINGS}\n            placeholder="${placeholder}"\n            coinData={coin}\n          />\n\n          `;

  content = content.slice(0, searchStart) + replacement + content.slice(metricsRowStart);
  
  // Remove searchTerm state from the main component as it's now handled by AssetSearch
  content = content.replace(/const \[searchTerm, setSearchTerm\] = useState\(""\);\n/, '');
  content = content.replace(/const debouncedSearchTerm = useDebounce\(searchTerm, 300\);\n/, '');
  content = content.replace(/const \[showSearchDropdown, setShowSearchDropdown\] = useState\(false\);\n/, '');
  content = content.replace(/const searchInputRef = useRef<HTMLDivElement>\(null\);\n/, '');
  
  // Remove handleSearch, searchResults, handleClickOutside useEffect
  content = content.replace(/useEffect\(\(\) => \{\n\s*function handleClickOutside[\s\S]*?\}, \[\]\);\n/, '');
  content = content.replace(/const searchResults = useMemo\([\s\S]*?\}, \[debouncedSearchTerm\]\);\n/, '');
  content = content.replace(/const handleSearch = \(e: FormEvent\) => \{[\s\S]*?setActiveCoinId\(foundId\);\n\s*};\n/, '');

  // Also fix SEARCH_MAPPINGS dependency if needed, but SEARCH_MAPPINGS doesn't depend on searchTerm anymore

  fs.writeFileSync(file, content);
}

refactorDashboard('src/pages/CryptoDashboard.tsx', '가상자산 검색 (예: 리플, 도지코인)');
refactorDashboard('src/pages/StockDashboard.tsx', '주식 종목 검색 (예: 삼성전자, 테슬라)');

