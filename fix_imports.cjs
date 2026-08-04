const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Ensure BarChart2 and TrendingUp are imported from lucide-react
if (!content.includes('BarChart2')) {
    content = content.replace(
        /import \{([\s\S]*?)\} from "lucide-react";/,
        'import { TrendingUp, BarChart2, $1 } from "lucide-react";'
    );
}

fs.writeFileSync('src/pages/Home.tsx', content);
