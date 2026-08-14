const fs = require('fs');

let content = fs.readFileSync('src/components/SolarSystem3D.tsx', 'utf8');

content = content.replace(/<button \n              onClick=\{\(e\) => \{ e\.stopPropagation\(\); setIsControlsOpen\(!isControlsOpen\); \}\}/g, '<button \n              aria-label="설정 메뉴 토글"\n              onClick={(e) => { e.stopPropagation(); setIsControlsOpen(!isControlsOpen); }}');

content = content.replace(/<button onClick=\{\(\) => setIsControlsOpen\(false\)\} className="md:hidden text-gray-500 hover:text-white p-1">/g, '<button aria-label="설정 메뉴 닫기" onClick={() => setIsControlsOpen(false)} className="md:hidden text-gray-500 hover:text-white p-1">');

content = content.replace(/<button \n                  onClick=\{\(\) => setSelectedPlanetId\(null\)\}/g, '<button \n                  aria-label="행성 정보 닫기"\n                  onClick={() => setSelectedPlanetId(null)}');

fs.writeFileSync('src/components/SolarSystem3D.tsx', content);

