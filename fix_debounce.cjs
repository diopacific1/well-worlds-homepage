const fs = require('fs');

function applyDebounce(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (!code.includes('useDebounce')) {
    code = code.replace(
      'import { useState, useEffect, useMemo, useRef } from "react";',
      'import { useState, useEffect, useMemo, useRef } from "react";\nimport { useDebounce } from "../hooks/useDebounce";'
    );
    // fallback if no useRef
    code = code.replace(
      'import { useState, useMemo, useEffect } from "react";',
      'import { useState, useMemo, useEffect } from "react";\nimport { useDebounce } from "../hooks/useDebounce";'
    );
    // fallback if Stories.tsx
    if (filePath.includes('Stories.tsx')) {
      code = code.replace(
        'import { useState, useMemo, useEffect, useRef } from "react";',
        'import { useState, useMemo, useEffect, useRef } from "react";\nimport { useDebounce } from "../hooks/useDebounce";'
      );
    }
  }

  // Inside component, find searchTerm and add debouncedSearchTerm
  if (!code.includes('debouncedSearchTerm')) {
    code = code.replace(
      /const \[searchTerm, setSearchTerm\] = useState\(""\);/g,
      'const [searchTerm, setSearchTerm] = useState("");\n  const debouncedSearchTerm = useDebounce(searchTerm, 300);'
    );

    // Replace searchTerm with debouncedSearchTerm inside useMemo
    if (filePath.includes('PlantJournal.tsx')) {
      code = code.replace(
        /e\.title\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)/g,
        'e.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())'
      );
      code = code.replace(
        /e\.content\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)/g,
        'e.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())'
      );
      code = code.replace(
        /t\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)/g,
        't.toLowerCase().includes(debouncedSearchTerm.toLowerCase())'
      );
      // update dependencies
      code = code.replace(
        /\[entries, searchTerm, filterActivity\]/g,
        '[entries, debouncedSearchTerm, filterActivity]'
      );
    }
    
    // For Stories.tsx, if there is a search term it would be there. 
    // Actually wait, does Stories.tsx have a search term? Let me check.
  }

  fs.writeFileSync(filePath, code);
}

applyDebounce('src/pages/PlantJournal.tsx');
// applyDebounce('src/pages/Stories.tsx'); // Will check Stories.tsx first
