const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add import statement for ActivityChart
const importStatement = "import { ActivityChart } from '../components/ActivityChart';\n";
content = content.replace('import { Helmet } from "react-helmet-async";', 'import { Helmet } from "react-helmet-async";\n' + importStatement);

// Insert ActivityChart at the end of the Bento Grid Layer
const bentoGridEndMarker = '</BentoCard>\n        </motion.section>\n      </div>';
const chartInsertion = `</BentoCard>
        </motion.section>
        
        {/* Activity & Usage Trends Chart */}
        <ActivityChart />
      </div>`;

content = content.replace(bentoGridEndMarker, chartInsertion);

fs.writeFileSync('src/pages/Home.tsx', content);
