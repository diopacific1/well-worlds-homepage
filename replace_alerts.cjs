const fs = require('fs');
const files = ['src/pages/PlantJournal.tsx', 'src/pages/Stories.tsx', 'src/pages/Guestbook.tsx', 'src/pages/AdminDashboard.tsx'];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('alert(') && !code.includes('import { toast }')) {
    code = code.replace(
      'import {',
      'import { toast } from "../components/Toast";\nimport {'
    );
  }

  // Replace simple patterns
  code = code.replace(/alert\("Firebase Storage 설정이 완료되지 않았습니다\."\);/g, 'toast.error("Firebase Storage 설정이 완료되지 않았습니다.");');
  code = code.replace(/alert\("이미지가 파이어베이스 스토리지에 성공적으로 업로드되었습니다!"\);/g, 'toast.success("이미지가 성공적으로 업로드되었습니다.");');
  code = code.replace(/alert\([^]*?err\.message\);/g, 'toast.error("오류가 발생했습니다: " + (err as any).message);');
  code = code.replace(/alert\("제목을 입력해주세요\."\);/g, 'toast.info("제목을 입력해주세요.");');
  code = code.replace(/alert\("내용을 입력해주세요\."\);/g, 'toast.info("내용을 입력해주세요.");');
  code = code.replace(/alert\("삭제 실패!"\);/g, 'toast.error("삭제 실패!");');
  code = code.replace(/alert\("지워졌습니다\."\);/g, 'toast.success("지워졌습니다.");');
  code = code.replace(/alert\(`삭제하는 동안 오류가 발생했습니다: \$\{err.message\}`\);/g, 'toast.error(`삭제하는 동안 오류가 발생했습니다: ${(err as any).message}`);');
  code = code.replace(/alert\("승인되었습니다\."\);/g, 'toast.success("승인되었습니다.");');
  code = code.replace(/alert\("오류가 발생했습니다\."\);/g, 'toast.error("오류가 발생했습니다.");');
  code = code.replace(/alert\("삭제되었습니다\."\);/g, 'toast.success("삭제되었습니다.");');
  code = code.replace(/alert\("포트폴리오가 추가되었습니다\."\);/g, 'toast.success("포트폴리오가 추가되었습니다.");');
  code = code.replace(/alert\("포트폴리오 추가 중 오류가 발생했습니다\."\);/g, 'toast.error("포트폴리오 추가 중 오류가 발생했습니다.");');
  
  // Custom manual replacements for remaining ones
  code = code.replace(/alert\(\s*"작성 실패: "\s*\+\s*\(error instanceof Error \? error\.message : "알 수 없는 오류"\)\s*\);/, 'toast.error("작성 실패: " + (error instanceof Error ? error.message : "알 수 없는 오류"));');
  code = code.replace(/alert\(\s*"이미지 처리 실패: "\s*\+\s*err\.message\s*\);/, 'toast.error("이미지 처리 실패: " + (err as any).message);');
  
  // Replace multiline alerts in PlantJournal & Stories
  code = code.replace(/alert\(\s*"Firebase Storage CORS 설정이 필요할 수 있습니다\.\\n" \+\s*"Google Cloud Console에서 CORS 정책을 설정해주세요\."\s*\);/g, 'toast.info("Firebase Storage CORS 설정이 필요할 수 있습니다. Google Cloud Console에서 CORS 정책을 설정해주세요.");');

  fs.writeFileSync(file, code);
});
