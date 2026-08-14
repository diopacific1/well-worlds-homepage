const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Unify all h2 tags inside BentoCard to be:
// className="text-3xl md:text-4xl font-display font-extrabold text-on-surface mb-4 tracking-tight group-hover:..."
content = content.replace(/className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight/g, 'className="text-3xl md:text-4xl font-display font-extrabold text-on-surface mb-4 tracking-tight');

// Unify descriptions
// "고요히 고개 들며 자라나는 반려 식물의 생명력. <br />\n                   자연이 가르쳐주는 기다림의 철학을 배우세요."
content = content.replace(/고요히 고개 들며 자라나는 반려 식물의 생명력\. <br \/>\s*자연이 가르쳐주는 기다림의 철학을 배우세요\./g, '고요히 자라나는 반려 식물의 생명력.<br />\n                  자연이 가르쳐주는 기다림을 배웁니다.');

// "온전히 나 자신에게만 몰입하는 침묵의 시간.<br />\n                  사유의 파편들을 모아 온전한 궤도를 완성합니다."
content = content.replace(/온전히 나 자신에게만 몰입하는 침묵의 시간\.<br \/>\s*사유의 파편들을 모아 온전한 궤도를 완성합니다\./g, '온전히 나에게 몰입하는 침묵의 시간.<br />\n                  사유의 파편을 모아 궤도를 완성합니다.');

// "수막을 넘어 흘러드는 또 다른 세계의 신호들.<br />\n                  당신의 흔적을 이 고요한 우물에 남겨주세요."
content = content.replace(/수막을 넘어 흘러드는 또 다른 세계의 신호들\.<br \/>\s*당신의 흔적을 이 고요한 우물에 남겨주세요\./g, '수막을 넘어 흘러드는 타인의 신호들.<br />\n                  당신의 흔적을 이 고요한 우물에 남깁니다.');

fs.writeFileSync('src/pages/Home.tsx', content);
