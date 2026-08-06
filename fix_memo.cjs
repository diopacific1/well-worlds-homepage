const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('export const MarketOverview = () => {')) {
    content = content.replace(
      'export const MarketOverview = () => {',
      'export const MarketOverview = React.memo(() => {'
    );
    content = content.replace(/};\s*$/, '});\n');
  } else if (content.includes('export const PriceTicker = () => {')) {
    content = content.replace(
      'export const PriceTicker = () => {',
      'export const PriceTicker = React.memo(() => {'
    );
    content = content.replace(/};\s*$/, '});\n');
  }

  fs.writeFileSync(file, content);
}

fix('src/components/MarketOverview.tsx');
fix('src/components/PriceTicker.tsx');
