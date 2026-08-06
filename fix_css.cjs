const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('--color-kr-up:')) {
    content = content.replace(
      '--color-forest: #2D4739;',
      '--color-forest: #2D4739;\n  --color-kr-up: #E13030;\n  --color-kr-down: #1261C4;\n  --color-ma5: #F59E0B;\n  --color-ma10: #8B5CF6;\n  --color-tooltip-bg: #151b2e;\n  --color-chart-grid: #E2E8F0;\n  --color-chart-text: #1E293B;'
    );
  }

  fs.writeFileSync(file, content);
}

fix('src/index.css');
