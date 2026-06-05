import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!auth) {
      setError("Firebase 인증 서비스가 시작되지 않았습니다. 환경 변수를 확인해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 로그인 성공 시 관리자 대시보드로 이동
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("이메일이나 비밀번호가 잘못되었습니다.");
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
          접근 권한이 있는 관리자(나)만 로그인할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="관리자 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 bg-surface-container border border-outline/30 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 bg-surface-container border border-outline/30 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          required
        />
        
        {error && (
          <div className="text-error text-sm font-medium text-center p-2 bg-error/10 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="mt-4 px-4 py-3 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "로그인"}
        </button>
      </form>
    </div>
  );
}
