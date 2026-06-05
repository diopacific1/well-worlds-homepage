import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Plus, FileText } from "lucide-react";
import { collection, query, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any[]>([]);

  // 예시: 관리자 전용 데이터(공지사항 혹은 포트폴리오 관리)를 불러온다고 가정
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (!db) return;
        // 관리자만 읽을 수 있는 컬렉션인 'admin_data' 또는 'portfolio'
        const q = query(collection(db, "portfolio"));
        const snapshot = await getDocs(q);
        setAdminData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("데이터 불러오기 실폐. 권한 확인 필요:", err);
      }
    };
    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    navigate("/"); // 로그아웃 후 메인(홈)으로 이동
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-outline/20 pb-8">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-on-surface flex items-center gap-3">
            <Settings className="text-primary w-8 h-8" />
            관리자 대시보드
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            이 페이지는 인증된 관리자(나)에게만 보입니다.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-error rounded-xl font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-surface border border-outline/20 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              포트폴리오 관리 (예시)
            </h2>
            <button className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {adminData.length === 0 ? (
              <p className="text-on-surface-variant text-sm bg-surface-container p-4 rounded-xl">
                아직 등록된 관리자 전용 데이터가 없습니다.<br/>
                Firestore에 'portfolio' 컬렉션을 생성하고 추가해보세요.
              </p>
            ) : (
              adminData.map((item) => (
                <div key={item.id} className="p-4 border border-outline/20 rounded-xl">
                  {JSON.stringify(item)}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-surface border border-outline/20 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-6">시스템 요약</h2>
          <ul className="space-y-3 text-on-surface-variant font-medium">
            <li className="flex justify-between p-3 bg-surface-container rounded-lg">
              <span>Firebase Auth</span>
              <span className="text-primary font-bold">인증됨</span>
            </li>
            <li className="flex justify-between p-3 bg-surface-container rounded-lg">
              <span>권한 수준</span>
              <span className="text-primary font-bold">최고 관리자</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
