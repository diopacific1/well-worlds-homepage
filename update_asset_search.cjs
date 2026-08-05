const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/AssetSearch.tsx', 'utf8');

// Add focusedIndex state
content = content.replace(
  'const [showSearchDropdown, setShowSearchDropdown] = useState(false);',
  'const [showSearchDropdown, setShowSearchDropdown] = useState(false);\n  const [focusedIndex, setFocusedIndex] = useState(-1);'
);

// Reset focusedIndex when term changes
content = content.replace(
  'setSearchTerm(e.target.value);',
  'setSearchTerm(e.target.value);\n                setFocusedIndex(-1);'
);

// Keyboard handling function
const keyboardHandler = `
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchDropdown || searchResults.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      onSelectAsset(searchResults[focusedIndex]);
      setSearchTerm("");
      setShowSearchDropdown(false);
      setFocusedIndex(-1);
    } else if (e.key === "Escape") {
      setShowSearchDropdown(false);
      setFocusedIndex(-1);
    }
  };
`;

content = content.replace(
  'const handleSearch = (e: React.FormEvent) => {',
  keyboardHandler + '\n  const handleSearch = (e: React.FormEvent) => {'
);

// Attach handleKeyDown to input
content = content.replace(
  'onChange={(e) => {',
  'onKeyDown={handleKeyDown}\n              onChange={(e) => {'
);

// Update dropdown rendering to use focusedIndex
content = content.replace(
  /className="w-full text-left px-4 py-3 hover:bg-surface-dim transition-colors flex items-center gap-3 border-b border-outline\/5 last:border-b-0"/g,
  'className={`w-full text-left px-4 py-3 hover:bg-surface-dim transition-colors flex items-center gap-3 border-b border-outline/5 last:border-b-0 ${focusedIndex === index ? "bg-surface-dim border-l-4 border-l-primary" : ""}`}'
);

// Map needs index
content = content.replace(
  'searchResults.map((id) => (',
  'searchResults.map((id, index) => ('
);

content = content.replace(
  'onSelectAsset(id);',
  'onSelectAsset(id);\n                      setFocusedIndex(-1);'
);

fs.writeFileSync('src/components/dashboard/AssetSearch.tsx', content);
