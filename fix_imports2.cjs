const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  'Activity\n} from "lucide-react";',
  'Activity,\n  TrendingUp,\n  BarChart2\n} from "lucide-react";'
);

fs.writeFileSync('src/pages/Home.tsx', content);
