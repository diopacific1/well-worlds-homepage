const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Remove the "우주 탐험하기" button and its wrapper
const buttonRegex = /<motion\.div\s+className=\{\`relative group[^>]*\`\}\s+whileHover=\{\{\s*scale:\s*1\.02\s*\}\}\s+whileTap=\{\{\s*scale:\s*0\.98\s*\}\}\s*>\s*\{\/\* Glowing Aura behind button \*\/\}\s*<div className="absolute -inset-1[^>]*\/>\s*<button[\s\S]*?<\/button>\s*<\/motion\.div>/;
content = content.replace(buttonRegex, '');

// 2. Remove the show3D logic from typography
content = content.replace(/\$\{show3D \? "opacity-0 select-none pointer-events-none" : "opacity-100 pointer-events-auto"\}/g, 'opacity-100 pointer-events-auto');

// 3. Replace the Full bleed wrapper for SolarSystem3D
const solarWrapperRegex = /\{\/\* Full bleed wrapper for SolarSystem3D background \*\/\}\s*<div className=\{\`transition-all duration-1000 \$\{show3D \? 'fixed inset-0 z-\[100\] bg-\[\#020205\] opacity-100 pointer-events-auto' : 'absolute inset-0 w-full h-full -z-10 opacity-100 pointer-events-auto'\}\`\}>\s*<SolarSystem3D onPlanetClick=\{handlePlanetClick\} isBackground=\{\!show3D\} \/>\s*\{\!show3D && \(\s*<div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" \/>\s*\)\}\s*\{show3D && \([\s\S]*?<\/div>\s*\)\}\s*<\/div>/;

const newSolarWrapper = `{/* Background for SolarSystem3D confined to HeroSection */}
        <div className="absolute inset-0 w-full h-full -z-10 pointer-events-auto">
          <SolarSystem3D onPlanetClick={handlePlanetClick} isBackground={true} />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        </div>`;

content = content.replace(solarWrapperRegex, newSolarWrapper);

// 4. Also remove the show3D state from Home component if it's there, but wait, HeroSection is a separate component?
// Let's check where `show3D` is defined.
fs.writeFileSync('src/pages/Home.tsx', content);
