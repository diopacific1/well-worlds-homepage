const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Change import to lazy
content = content.replace(
  'import SolarSystem3D from "../components/SolarSystem3D";',
  'import { Suspense, lazy } from "react";\nconst SolarSystem3D = lazy(() => import("../components/SolarSystem3D"));'
);

// Wrap <SolarSystem3D /> in Suspense
content = content.replace(
  '<SolarSystem3D onPlanetClick={handlePlanetClick} isBackground={true} />',
  '<Suspense fallback={<div className="w-full h-full min-h-[400px] flex items-center justify-center text-on-surface-variant"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>}>\n            <SolarSystem3D onPlanetClick={handlePlanetClick} isBackground={true} />\n          </Suspense>'
);

fs.writeFileSync('src/pages/Home.tsx', content);

