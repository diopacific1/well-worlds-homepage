import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsAuthenticated(false);
      return;
    }

    // Firebase 인증 상태 리스너 등록
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // user가 있으면 인증 통과, 없으면 실패
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // 인증되지 않았다면 로그인 페이지로 튕겨냅니다.
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // 인증되었다면 자식 라우트(Outlet)를 렌더링합니다.
  return <Outlet />;
}
