const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

const regex = /\{\/\* Full bleed wrapper for SolarSystem3D background \*\/\}\s*<div className=\{\`transition-opacity duration-1000 \$\{show3D \? 'fixed inset-0 z-50 bg-\[\#020205\] opacity-100 pointer-events-auto' : 'absolute inset-0 w-full h-full -z-10 opacity-0 pointer-events-none'\}\`\}>\s*\{show3D && \(\s*<>\s*<SolarSystem3D onPlanetClick=\{handlePlanetClick\} \/>\s*<div className="absolute bottom-6 left-6 z-\[100\] pointer-events-auto">\s*<button \s*onClick=\{\(\) => setShow3D\(false\)\}\s*className="px-6 py-3 bg-black\/60 text-white hover:bg-black\/80 transition-all duration-300 rounded-full font-bold shadow-lg backdrop-blur-md border border-white\/20 flex items-center gap-2"\s*>\s*<X className="w-5 h-5" \/>\s*3D 뷰 닫기\s*<\/button>\s*<\/div>\s*<\/>\s*\)\}\s*<\/div>/;

const replacement = `{/* Full bleed wrapper for SolarSystem3D background */}
        <div className={\`transition-all duration-1000 \${show3D ? 'fixed inset-0 z-[100] bg-[#020205] opacity-100 pointer-events-auto' : 'absolute inset-0 w-full h-full -z-10 opacity-100 pointer-events-auto'}\`}>
          <SolarSystem3D onPlanetClick={handlePlanetClick} isBackground={!show3D} />
          {!show3D && (
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
          )}
          {show3D && (
            <div className="absolute bottom-6 left-6 z-[100] pointer-events-auto">
              <button 
                 onClick={() => setShow3D(false)}
                 className="px-6 py-3 bg-black/60 text-white hover:bg-black/80 transition-all duration-300 rounded-full font-bold shadow-lg backdrop-blur-md border border-white/20 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                3D 뷰 닫기
              </button>
            </div>
          )}
        </div>`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/pages/Home.tsx', content);
