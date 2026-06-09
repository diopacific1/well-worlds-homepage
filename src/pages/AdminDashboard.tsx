import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Plus, FileText, CheckCircle, XCircle } from "lucide-react";
import { collection, query, getDocs, where, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any[]>([]);
  const [pendingGuestbook, setPendingGuestbook] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoading(true);
        try {
          if (!db) return;
          // 1. 포트폴리오
          const pq = query(collection(db, "portfolio"));
          const pSnap = await getDocs(pq);
          setAdminData(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  
          // 2. 승인 대기중인 방명록 조회
          const gq = query(collection(db, "guestbook"), where("status", "==", "pending"));
          const gSnap = await getDocs(gq);
          const entries = gSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // 클라이언트에서 정렬 (단순화를 위해)
          entries.sort((a: any, b: any) => {
            const aTime = a.createdAt?.toMillis() || 0;
            const bTime = b.createdAt?.toMillis() || 0;
            return bTime - aTime;
          });
          setPendingGuestbook(entries);
        } catch (err) {
          console.error("데이터 불러오기 싪패:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Not logged in -> handle logout or stop loading
        setIsLoading(false);
        navigate("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    navigate("/");
  };

  const handleApprove = async (id: string) => {
    if (!db || !window.confirm("이 흔적을 우물가에 승인하시겠습니까?")) return;
    try {
      await updateDoc(doc(db, "guestbook", id), { status: "approved" });
      setPendingGuestbook(prev => prev.filter(item => item.id !== id));
      alert("승인되었습니다.");
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  const handleReject = async (id: string) => {
    if (!db || !window.confirm("이 흔적을 삭제(반려)하시겠습니까? 복구할 수 없습니다.")) return;
    try {
      await deleteDoc(doc(db, "guestbook", id));
      setPendingGuestbook(prev => prev.filter(item => item.id !== id));
      alert("삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 w-full animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline/20 pb-8">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-on-surface flex items-center gap-3">
            <Settings className="text-primary w-8 h-8" />
            관리자 대시보드
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            이 페이지는 인증된 관리자에게만 노출되며, 각종 문서 검토 및 시스템 관리가 가능합니다.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-error rounded-xl font-bold transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </header>

      {/* 승인 대기 중인 방명록 (새로 추가됨) */}
      <section className="bg-surface border border-outline/20 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            방명록 승인 대기 목록
          </h2>
          <span className="bg-error/10 text-error px-3 py-1 rounded-full text-sm font-bold">
            대기 {pendingGuestbook.length}건
          </span>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center p-8 text-on-surface-variant">데이터를 불러오는 중...</p>
          ) : pendingGuestbook.length === 0 ? (
            <p className="text-center text-on-surface-variant text-sm bg-surface-container-lowest p-8 rounded-2xl border border-outline/10">
              승인 대기 중인 흔적이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingGuestbook.map((entry) => (
                <div key={entry.id} className="p-5 border border-outline/20 bg-surface-container-lowest rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-primary truncate pr-2">{entry.nickname}</span>
                    <span className="text-[10px] text-on-surface-variant">
                      {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface font-medium whitespace-pre-wrap break-all flex-1 line-clamp-4">
                    {entry.message}
                  </p>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-outline/10">
                    <button 
                      onClick={() => handleApprove(entry.id)}
                      className="flex-1 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors rounded-lg text-sm font-bold"
                    >
                      승인
                    </button>
                    <button 
                      onClick={() => handleReject(entry.id)}
                      className="flex-1 py-1.5 bg-error/10 hover:bg-error text-error hover:text-white transition-colors rounded-lg text-sm font-bold"
                    >
                      반려(삭제)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
