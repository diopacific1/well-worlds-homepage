import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Loader2 } from "lucide-react";

const ADMIN_UID = "w02kvOK1b0SiPGgmQRX3g34ArSt2";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsAuthenticated(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 단순히 user가 있는지가 아니라, UID가 관리자의 것과 일치하는지 확인
      if (user && user.uid === ADMIN_UID) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}

