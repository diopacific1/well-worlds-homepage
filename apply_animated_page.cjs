const fs = require('fs');

const pages = [
  'src/pages/Home.tsx',
  'src/pages/CryptoDashboard.tsx',
  'src/pages/PlantJournal.tsx',
  'src/pages/Stories.tsx',
  'src/pages/Guestbook.tsx'
];

pages.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes('AnimatedPage')) {
    // Add import
    code = code.replace(
      'import {',
      'import AnimatedPage from "../components/AnimatedPage";\nimport {'
    );
    
    // Wrap main return div
    // We need to find the main return statement of the default export
    const returnRegex = /return\s*\(\s*(<div[^>]*>)/;
    const match = code.match(returnRegex);
    if (match) {
      code = code.replace(
        match[0],
        'return (\n    <AnimatedPage>\n      ' + match[1]
      );
      // Now we need to append </AnimatedPage> right before the last ); 
      // But it's risky to just replace the last ); 
      // Let's use a simpler string replacement for the end of the file.
      // Usually it ends with `    </div>\n  );\n}`
      code = code.replace(
        /<\/div>\s*\);\s*\}\s*$/,
        '</div>\n    </AnimatedPage>\n  );\n}\n'
      );
      fs.writeFileSync(file, code);
    }
  }
});

