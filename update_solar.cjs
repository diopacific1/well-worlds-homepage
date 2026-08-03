const fs = require('fs');
let content = fs.readFileSync('src/components/SolarSystem3D.tsx', 'utf8');

// Update function signature
content = content.replace(
  /export default function SolarSystem3D\(\{ onPlanetClick \}: \{ onPlanetClick\?: \(id: string\) => void \}\) \{/,
  'export default function SolarSystem3D({ onPlanetClick, isBackground = false }: { onPlanetClick?: (id: string) => void, isBackground?: boolean }) {'
);

// Update Canvas pointer events and OrbitControls
content = content.replace(
  /<Canvas camera=\{\{ position: \[0, 20, 40\], fov: 45 \}\} shadows className="outline-none" style=\{\{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto', touchAction: 'none' \}\}>/,
  `<Canvas camera={{ position: [0, 20, 40], fov: 45 }} shadows className="outline-none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: isBackground ? 'none' : 'auto', touchAction: isBackground ? 'auto' : 'none' }}>`
);

// We can keep OrbitControls but disable pan/zoom if isBackground
content = content.replace(
  /<OrbitControls\s*ref=\{controlsRef\}\s*enablePan=\{true\}\s*enableZoom=\{true\}/,
  `<OrbitControls 
          ref={controlsRef}
          enablePan={!isBackground} 
          enableZoom={!isBackground}`
);

// Hide NASA UI Overlay if isBackground
content = content.replace(
  /\{\/\* NASA Style UI Overlay \*\/\}\s*<div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">/,
  `{/* NASA Style UI Overlay */}
      {!isBackground && (
      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">`
);

// Close the !isBackground wrapper just before the last </div>
content = content.replace(
  /<\/div>\s*<\/div>\s*\)$/,
  `</div>
      )}
    </div>
  )`
);

fs.writeFileSync('src/components/SolarSystem3D.tsx', content);
