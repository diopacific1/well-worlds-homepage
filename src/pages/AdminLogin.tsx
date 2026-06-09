import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Loader2, Info } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'google' | 'email'>('google');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
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
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("팝업 창이 닫혀서 로그인이 취소되었습니다.\n\n⚠️ 주의: 모바일 기기나 사내 보안망에서는 팝업 로그인이 차단될 수 있습니다. AI Studio 우측 상단의 '새 탭에서 열기' 아이콘을 눌러 새 창에서 시도하시거나, 하단의 이메일 로그인을 이용해주세요.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("이 도메인은 승인되지 않았습니다. Firebase 콘솔에서 도메인을 승인해주세요.");
      } else if (err.message && err.message.includes("Third-party cookies")) {
        setError("서드파티 쿠키가 차단되어 로그인을 할 수 없습니다. 우측 상단의 '새 탭' 아이콘을 눌러주세요.");
      } else {
        setError("구글 로그인에 실패했습니다: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed") {
        setError("이메일 로그인이 비활성화되어 있습니다.\n\n해결방법: Firebase 콘솔에 접속하여 Authentication > Sign-in method 메뉴에서 '이메일/비밀번호'를 사용 설정(활성화) 해주셔야 합니다.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("잘못된 아이디 이거나 비밀번호 입니다.");
      } else {
        setError("이메일 로그인에 실패했습니다: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-surface border border-outline/20 rounded-3xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col items-center mb-6 gap-4">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface">관리자 로그인</h1>
        <p className="text-sm text-on-surface-variant text-center">
          접근 권한이 있는 관리자(diopacific1@gmail.com)만 예외적으로 접근 가능합니다.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="text-error text-sm font-medium p-4 bg-error/10 rounded-xl whitespace-pre-wrap leading-relaxed shadow-sm">
            {error}
            {error.includes('이메일 로그인이 비활성화') && (
              <a 
                href={`https://console.firebase.google.com/project/${auth?.app?.options?.projectId || 'home-page-1-b923f'}/authentication/providers`}
                target="_blank" 
                rel="noreferrer"
                className="block mt-4 p-3 bg-white/50 rounded-lg text-primary font-bold text-center underline"
              >
                👉 Firebase 콘솔 바로가기 (본인 프로젝트일 경우)
              </a>
            )}
            {error.includes('팝업 창이 닫혀서') && (
              <button 
                onClick={() => window.open(window.location.href, "_blank")}
                className="block w-full mt-4 p-3 bg-white/50 text-error rounded-lg font-bold text-center underline"
              >
                👉 창 분리해서 다시 열기
              </button>
            )}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex p-1 bg-surface-container rounded-xl">
          <button 
            type="button"
            onClick={() => { setLoginMethod('google'); setError(""); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${loginMethod === 'google' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            구글 로그인
          </button>
          <button 
            type="button"
            onClick={() => { setLoginMethod('email'); setError(""); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${loginMethod === 'email' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            이메일 로그인
          </button>
        </div>

        {loginMethod === 'google' ? (
          <div className="flex flex-col gap-4 mt-2">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="px-4 py-4 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Google 계정으로 관리자 로그인"}
            </button>

            <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20 text-xs text-on-surface-variant leading-relaxed flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <div>
                <strong>모바일/사내망 접속 시 주의:</strong> 브라우저 설정에 따라 팝업창이 차단될 경우 오류가 발생할 수 있습니다! 우측 상단의 <strong className="text-primary">"새 탭에서 열기"</strong>를 클릭해 전체 화면에서 접속하시면 정상 작동합니다.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 mt-2">
            <input
              type="email"
              placeholder="관리자 이메일 (diopacific1@gmail.com)"
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
            
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="mt-2 px-4 py-4 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "이메일 로그인"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
