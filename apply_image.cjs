const fs = require('fs');

function applyToStories() {
  let code = fs.readFileSync('src/pages/Stories.tsx', 'utf8');
  if (!code.includes('import ImageWithFallback')) {
    code = code.replace(
      'import {',
      'import ImageWithFallback from "../components/ImageWithFallback";\nimport {'
    );
  }
  
  // Try simple replacements if regex misses
  code = code.replace(/<img[^>]*src=\{post\.image\}[^>]*\/>/, '<ImageWithFallback src={post.image} alt="게시물 표지 이미지" loading="lazy" decoding="async" fetchPriority="low" className="w-full object-cover h-full min-h-[200px] max-h-[500px]" containerClassName="w-full h-full min-h-[200px] max-h-[500px]" />');
  
  code = code.replace(/<img[^>]*src=\{newImage\}[^>]*\/>/, '<ImageWithFallback src={newImage} alt="첨부된 이미지 미리보기" referrerPolicy="no-referrer" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" containerClassName="w-full h-full" />');
  
  fs.writeFileSync('src/pages/Stories.tsx', code);
}

function applyToPlantJournal() {
  let code = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
  if (!code.includes('import ImageWithFallback')) {
    code = code.replace(
      'import {',
      'import ImageWithFallback from "../components/ImageWithFallback";\nimport {'
    );
  }
  
  code = code.replace(/<img[^>]*src=\{formParams\.image\}[^>]*\/>/, '<ImageWithFallback src={formParams.image} alt="커버 이미지 미리보기" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" containerClassName="w-full h-full" />');
  
  code = code.replace(/<img[^>]*src=\{entry\.image\}[^>]*\/>/, '<ImageWithFallback src={entry.image} alt={`${entry.title} 이미지`} loading="lazy" decoding="async" className="w-full h-full object-cover" containerClassName="w-full h-full" />');
  
  fs.writeFileSync('src/pages/PlantJournal.tsx', code);
}

applyToStories();
applyToPlantJournal();
