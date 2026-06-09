import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    if (!auth) {
      setError("Firebase 인증 서비스가 시작되지 않았습니다. 환경 변수를 확인해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // 로그인 성공 시 관리자 대시보드로 이동
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("로그인 창이 닫혔습니다. 다시 시도해주세요.");
      } else {
        setError("로그인에 실패했습니다: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-surface border border-outline/20 rounded-3xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col items-center mb-8 gap-4">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface">관리자 로그인</h1>
        <p className="text-sm text-on-surface-variant text-center">
          접근 권한이 있는 관리자만 로그인할 수 있습니다.<br/>
          (diopacific1@gmail.com 계정으로 로그인해주세요)
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="text-error text-sm font-medium text-center p-2 bg-error/10 rounded-lg whitespace-pre-wrap">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="mt-4 px-4 py-3 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Google 계정으로 관리자 로그인"}
        </button>
      </div>
    </div>
  );
}
