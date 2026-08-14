const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAssetData.ts', 'utf8');
content = content.replace(/catch \(err: unknown\) \{[\s\S]*?\}/g, 
`catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError" && isMounted) {
          console.error("API Error:", err.message);
          setError(err.message);
          setData(null);
          setLoading(false);
        } else if (!(err instanceof Error) && isMounted) {
          setError(String(err));
          setData(null);
          setLoading(false);
        }
      }`);
fs.writeFileSync('src/hooks/useAssetData.ts', content);

let adminLogin = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');
adminLogin = adminLogin.replace(/catch \(err: unknown\) \{/g, 'catch (e: unknown) {\n      const err = e as { code?: string, message?: string };');
fs.writeFileSync('src/pages/AdminLogin.tsx', adminLogin);

let guestbook = fs.readFileSync('src/pages/Guestbook.tsx', 'utf8');
guestbook = guestbook.replace(/toast\.error\("방명록을 등록하는 동안 오류가 발생했습니다: " \+ err\.message\);/g, 'toast.error("방명록을 등록하는 동안 오류가 발생했습니다: " + (err instanceof Error ? err.message : String(err)));');
fs.writeFileSync('src/pages/Guestbook.tsx', guestbook);
