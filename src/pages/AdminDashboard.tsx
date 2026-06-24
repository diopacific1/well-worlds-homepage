import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Plus, FileText, CheckCircle, Trash2, Edit3, X, ExternalLink } from "lucide-react";
import { collection, query, getDocs, where, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, orderBy } from "firebase/firestore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any[]>([]);
  const [pendingGuestbook, setPendingGuestbook] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 포트폴리오 폼 상태
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    description: "",
    link: "",
    techStack: ""
  });

  // 데이터 로드
  const loadData = async () => {
    if (!db) return;
    try {
      // 1. 포트폴리오
      const pq = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
      const pSnap = await getDocs(pq);
      setAdminData(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // 2. 승인 대기중인 방명록 조회
      const gq = query(collection(db, "guestbook"), where("status", "==", "pending"));
      const gSnap = await getDocs(gq);
      const entries = gSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      entries.sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : (new Date(a.createdAt).getTime() || 0);
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : (new Date(b.createdAt).getTime() || 0);
        return bTime - aTime;
      });
      setPendingGuestbook(entries);
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
      // Fallback: If orderBy fails because of missing index, try without orderBy
      try {
        const pq = query(collection(db, "portfolio"));
        const pSnap = await getDocs(pq);
        setAdminData(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => {
           const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
           const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
           return bTime - aTime;
        }));
      } catch (e) {
        console.error("Fallback load failed:", e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoading(true);
        await loadData();
      } else {
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

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "portfolio"), {
        ...portfolioForm,
        createdAt: serverTimestamp()
      });
      alert("포트폴리오가 추가되었습니다.");
      setPortfolioForm({ title: "", description: "", link: "", techStack: "" });
      setIsPortfolioModalOpen(false);
      await loadData(); // Reload to show the new item
    } catch (err) {
      console.error(err);
      alert("포트폴리오 추가 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!db || !window.confirm("이 포트폴리오를 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "portfolio", id));
      setAdminData(prev => prev.filter(item => item.id !== id));
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
                      {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString() : (entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '')}
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
              포트폴리오 관리
            </h2>
            <button 
              onClick={() => setIsPortfolioModalOpen(true)}
              className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
               <p className="text-center p-4 text-on-surface-variant">데이터를 불러오는 중...</p>
            ) : adminData.length === 0 ? (
              <p className="text-on-surface-variant text-sm bg-surface-container p-4 rounded-xl text-center">
                아직 등록된 포트폴리오가 없습니다.<br/>
                우측 상단의 + 버튼을 눌러 추가해보세요.
              </p>
            ) : (
              adminData.map((item) => (
                <div key={item.id} className="p-5 border border-outline/20 rounded-xl bg-surface-container-lowest flex flex-col gap-2 relative group hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start pr-8">
                    <h3 className="font-bold text-lg text-on-surface">{item.title}</h3>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors text-sm flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        링크
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant line-clamp-2">{item.description}</p>
                  {item.techStack && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.techStack.split(',').map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono bg-surface-variant/50 text-on-surface-variant px-2 py-0.5 rounded-md">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={() => handleDeletePortfolio(item.id)}
                    className="absolute top-4 right-4 p-1.5 text-error/60 hover:text-error hover:bg-error/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* Portfolio Add Modal */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-outline/20 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-on-surface">새 포트폴리오 추가</h3>
              <button 
                onClick={() => setIsPortfolioModalOpen(false)}
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPortfolio} className="p-6 space-y-4 bg-surface">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant px-1">프로젝트명</label>
                <input 
                  required
                  type="text" 
                  placeholder="프로젝트 이름"
                  value={portfolioForm.title}
                  onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})}
                  className="w-full bg-surface-container border border-outline/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant px-1">설명</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="프로젝트에 대한 간단한 설명"
                  value={portfolioForm.description}
                  onChange={e => setPortfolioForm({...portfolioForm, description: e.target.value})}
                  className="w-full bg-surface-container border border-outline/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant px-1">링크 (선택)</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={portfolioForm.link}
                  onChange={e => setPortfolioForm({...portfolioForm, link: e.target.value})}
                  className="w-full bg-surface-container border border-outline/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant px-1">기술 스택</label>
                <input 
                  type="text" 
                  placeholder="React, TypeScript, Firebase (쉼표로 구분)"
                  value={portfolioForm.techStack}
                  onChange={e => setPortfolioForm({...portfolioForm, techStack: e.target.value})}
                  className="w-full bg-surface-container border border-outline/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-variant transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "추가 중..." : "추가하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
