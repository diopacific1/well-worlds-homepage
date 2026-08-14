const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');
content = content.replace("import { ActivityChart } from '../components/ActivityChart';", "const ActivityChart = lazy(() => import('../components/ActivityChart').then(module => ({ default: module.ActivityChart })));");

content = content.replace("<ActivityChart />", "<Suspense fallback={<div className=\"w-full h-[300px] bg-surface-dim/20 rounded-2xl animate-pulse\" />}>\n          <ActivityChart />\n        </Suspense>");
fs.writeFileSync('src/pages/Home.tsx', content);
