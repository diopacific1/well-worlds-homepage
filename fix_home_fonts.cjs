const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Unify "디지털 정원" (Digital Garden)
content = content.replace(
  /className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight group-hover:text-sage transition-colors duration-300">\s*디지털 정원\s*<\/h2>\s*<p className="text-base sm:text-lg text-on-surface-variant\/90 leading-relaxed font-medium break-words whitespace-pre-wrap">\s*고요히 고개 들며 자라나는 반려 식물의 생명력\. <br \/>\s*자연이 가르쳐주는 기다림의 철학을 배우세요\.\s*<\/p>/g,
  `className="text-3xl md:text-4xl font-display font-extrabold text-on-surface mb-4 tracking-tight group-hover:text-sage transition-colors duration-300">
                  디지털 정원
                </h2>
                <p className="text-base sm:text-lg text-on-surface-variant/90 leading-relaxed font-medium break-words whitespace-pre-wrap">
                  고요히 자라나는 반려 식물의 생명력.<br />
                  자연이 가르쳐주는 기다림을 배웁니다.
                </p>`
);

// Unify "나의 세계" (Stories/Portfolio)
content = content.replace(
  /className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight group-hover:text-secondary transition-colors duration-300">\s*나의 세계\s*<\/h2>\s*<p className="text-base sm:text-lg text-on-surface-variant\/90 leading-relaxed font-medium break-words whitespace-pre-wrap">\s*온전히 나 자신에게만 몰입하는 침묵의 시간\.<br \/>\s*사유의 파편들을 모아 온전한 궤도를 완성합니다\.\s*<\/p>/g,
  `className="text-3xl md:text-4xl font-display font-extrabold text-on-surface mb-4 tracking-tight group-hover:text-secondary transition-colors duration-300">
                  나의 세계
                </h2>
                <p className="text-base sm:text-lg text-on-surface-variant/90 leading-relaxed font-medium break-words whitespace-pre-wrap">
                  온전히 나에게 몰입하는 침묵의 시간.<br />
                  사유의 파편을 모아 궤도를 완성합니다.
                </p>`
);

// Unify "머니월드 | 가상자산" (Crypto)
content = content.replace(
  /className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">\s*머니월드 <span className="text-lg opacity-70">\| 가상자산<\/span>\s*<\/h2>\s*<p className="text-sm sm:text-base text-on-surface-variant\/90 leading-relaxed font-medium break-words whitespace-pre-wrap">\s*실시간 가상자산의 파동 관측\.<br \/>\s*심연의 데이터를 탐색하세요\.\s*<\/p>/g,
  `className="text-3xl md:text-4xl font-display font-extrabold text-on-surface mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
                  머니월드 <span className="text-xl md:text-2xl opacity-70 font-bold">| 가상자산</span>
                </h2>
                <p className="text-base sm:text-lg text-on-surface-variant/90 leading-relaxed font-medium break-words whitespace-pre-wrap">
                  실시간 가상자산 파동의 관측.<br />
                  심연의 데이터를 직관적으로 탐색합니다.
                </p>`
);

// Unify "머니월드 | 한국 주식" (Stock)
content = content.replace(
  /className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight group-hover:text-emerald-500 transition-colors duration-300">\s*머니월드 <span className="text-lg opacity-70">\| 한국 주식<\/span>\s*<\/h2>\s*<p className="text-sm sm:text-base text-on-surface-variant\/90 leading-relaxed font-medium break-words whitespace-pre-wrap">\s*글로벌 기업의 가치 흐름\.<br \/>\s*자본의 동향을 파악하세요\.\s*<\/p>/g,
  `className="text-3xl md:text-4xl font-display font-extrabold text-on-surface mb-4 tracking-tight group-hover:text-emerald-500 transition-colors duration-300">
                  머니월드 <span className="text-xl md:text-2xl opacity-70 font-bold">| 한국 주식</span>
                </h2>
                <p className="text-base sm:text-lg text-on-surface-variant/90 leading-relaxed font-medium break-words whitespace-pre-wrap">
                  주요 기업들의 가치와 자본 흐름.<br />
                  시장의 동향을 빠르게 파악합니다.
                </p>`
);

// Unify "방명록" (Guestbook)
content = content.replace(
  /className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight group-hover:text-sky-dust transition-colors duration-300 drop-shadow-sm">\s*방명록\s*<\/h2>\s*<p className="text-base sm:text-lg text-on-surface-variant\/90 leading-relaxed font-medium break-words whitespace-pre-wrap text-shadow-sm">\s*수막을 넘어 흘러드는 또 다른 세계의 신호들\.<br \/>\s*당신의 흔적을 이 고요한 우물에 남겨주세요\.\s*<\/p>/g,
  `className="text-3xl md:text-4xl font-display font-extrabold text-on-surface mb-4 tracking-tight group-hover:text-sky-dust transition-colors duration-300 drop-shadow-sm">
                  방명록
                </h2>
                <p className="text-base sm:text-lg text-on-surface-variant/90 leading-relaxed font-medium break-words whitespace-pre-wrap text-shadow-sm">
                  수막을 넘어 흘러드는 타인의 신호들.<br />
                  당신의 흔적을 이 고요한 우물에 남깁니다.
                </p>`
);

fs.writeFileSync('src/pages/Home.tsx', content);
