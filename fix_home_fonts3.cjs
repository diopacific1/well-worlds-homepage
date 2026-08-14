const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// "디지털 정원"
content = content.replace(
  /고요히 고개 들며 자라나는 반려 식물의 생명력\. <br \/>\s*나의 감정과 사색의 습도로 흙 위에 자라나는 온전한 기억의 정원을 가꾸어보세요\./g,
  '고요히 자라나는 반려 식물의 생명력.<br />\n                  자연이 가르쳐주는 기다림을 배웁니다.'
);

// "나의 세계"
content = content.replace(
  /온전히 나 자신에게만 몰입하는 침묵의 시간\.<br \/>\s*내면의 잔잔한 고백과 소중한 가치들을 세상과 단절된 비밀 아카이브에 영원히 새겨보세요\./g,
  '온전히 나에게 몰입하는 침묵의 시간.<br />\n                  사유의 파편을 모아 궤도를 완성합니다.'
);

// "방명록"
content = content.replace(
  /수막을 넘어 흘러드는 또 다른 세계의 신호들\.<br \/>\s*이곳을 스쳐 간 탐험가들의 사유를 마주하고, 당신만의 파동을 남겨보세요\./g,
  '수막을 넘어 흘러드는 타인의 신호들.<br />\n                  당신의 흔적을 이 고요한 우물에 남깁니다.'
);

fs.writeFileSync('src/pages/Home.tsx', content);
