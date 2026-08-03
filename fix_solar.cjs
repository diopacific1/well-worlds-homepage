const fs = require('fs');
let content = fs.readFileSync('src/components/SolarSystem3D.tsx', 'utf8');

// Find the last 3 lines:
//     </div>
//   );
// }

const regex = /<\/div>\s*<\/div>\s*\)\s*;\s*\}/;
content = content.replace(regex, '    </div>\n      )}\n    </div>\n  );\n}');

fs.writeFileSync('src/components/SolarSystem3D.tsx', content);
