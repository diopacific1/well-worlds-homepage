const fs = require('fs');

let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

if (!code.includes('debouncedSearchTerm')) {
  code = code.replace(
    'import { useState, FormEvent, useEffect, useMemo } from "react";',
    'import { useState, FormEvent, useEffect, useMemo } from "react";\nimport { useDebounce } from "../hooks/useDebounce";'
  );

  code = code.replace(
    'const [searchTerm, setSearchTerm] = useState("");',
    'const [searchTerm, setSearchTerm] = useState("");\n  const debouncedSearchTerm = useDebounce(searchTerm, 300);'
  );

  code = code.replace(
    'const term = searchTerm.toLowerCase().trim();',
    'const term = debouncedSearchTerm.toLowerCase().trim();'
  );

  code = code.replace(
    '[searchTerm]',
    '[debouncedSearchTerm]'
  );
}

fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
