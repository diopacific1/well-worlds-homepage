const fs = require('fs');

let code = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');

// The problematic block:
//      try {
//        const base64Url = await new Promise<string>((resolve, reject) => {
//          const reader = new FileReader();
//          reader.readAsDataURL(file);
//          reader.onload = () => resolve(reader.result as string);
//          reader.onerror = (e) => reject(e);
//        });
//        setFormParams({ ...formParams, image: base64Url });
//        toast.error("오류가 발생했습니다: " + (err as any).message);
//      }
//    } finally {

code = code.replace(
  /setFormParams\(\{ \.\.\.formParams, image: base64Url \}\);\n\s*toast\.error\("오류가 발생했습니다: " \+ \(err as any\)\.message\);\n\s*\}/,
  `setFormParams({ ...formParams, image: base64Url });\n        toast.info("파이어베이스 업로드 실패, 브라우저 로컬 데이터로 대체했습니다.");\n      } catch (fallbackErr) {\n        toast.error("이미지 처리 실패: " + (fallbackErr as any).message);\n      }`
);

fs.writeFileSync('src/pages/PlantJournal.tsx', code);
