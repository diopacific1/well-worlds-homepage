import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Loader2, Send } from "lucide-react";
import { motion } from "motion/react";

interface GuestbookEntry {
  id: string;
  nickname: string;
  message: string;
  createdAt: any;
  status: "pending" | "approved" | "rejected";
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form states
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!db) {
      setError("Firebase가 연결되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    // 일반 방문자는 승인된 내역만 볼 수 있음
    const q = query(
      collection(db, "guestbook"), 
      where("status", "==", "approved")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GuestbookEntry));
      fetched.sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      });
      setEntries(fetched);
      setIsLoading(false);
    }, (err) => {
      console.error("Guestbook fetch error:", err);
      setError("방명록을 불러오는 데 실패했습니다.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim()) return;
    
    // Client-side validation matches rules
    setSubmitError("");
    if (nickname.trim().length > 20) {
      setSubmitError("닉네임은 20자 이내로 입력해주세요.");
      return;
    }
    if (message.trim().length > 500) {
      setSubmitError("메시지는 500자 이내로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!db) throw new Error("Firebase DB가 초기화되지 않았습니다.");
      
      const docData = {
        nickname: nickname.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
        status: "pending"
      };
      
      // 타임아웃을 설정하여 무한 대기를 방지합니다.
      const addDocPromise = addDoc(collection(db, "guestbook"), docData);
      
      let timeoutId: any;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("서버 연동 지연: 방명록 작성 권한이나 네트워크 연결을 확인해주세요."));
        }, 12000);
      });
      
      await Promise.race([addDocPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      
      setNickname("");
      setMessage("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setSubmitError(`방명록 등록 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10 w-full animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col gap-3 text-center items-center pt-8">
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-on-surface">탐험가의 흔적</h1>
        <p className="text-on-surface-variant font-medium text-sm md:text-base max-w-lg">
          이 우물에 찾아오신 분들의 발자취를 남겨주세요. <br className="hidden md:block" />
          남겨주신 메시지는 관리자 확인 후 우물가에 새겨집니다.
        </p>
      </header>

      {/* 방명록 작성 폼 */}
      <section className="bg-surface border border-outline/20 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        {submitSuccess ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">소중한 흔적이 남겨졌습니다!</h3>
            <p className="text-on-surface-variant text-sm">관리자가 확인한 후에 정식으로 기록됩니다.</p>
            <button 
              onClick={() => setSubmitSuccess(false)}
              className="mt-6 px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors"
            >
              새로운 메시지 남기기
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="nickname" className="block text-xs font-bold text-on-surface-variant mb-1 ml-1">탐험가 이름 (필수, 최대 20자)</label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                required
                placeholder="어떤 이름으로 남길까요?"
                className="w-full bg-surface-container-lowest border border-outline/20 p-4 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-on-surface"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-bold text-on-surface-variant mb-1 ml-1">남길 메시지 (필수, 최대 500자)</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                required
                rows={4}
                placeholder="이곳에 남기고 싶은 이야기를 적어주세요. (욕설, 비방, 광고는 승인되지 않습니다.)"
                className="w-full bg-surface-container-lowest border border-outline/20 p-4 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-on-surface resize-none"
              />
            </div>
            <div className="flex justify-end pt-2 items-center gap-4">
              {submitError && <span className="text-error text-sm font-semibold">{submitError}</span>}
              <button
                type="submit"
                disabled={isSubmitting || !nickname.trim() || !message.trim()}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> 기록 남기기</>}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 방명록 목록 */}
      <section className="flex flex-col gap-6 pt-4">
        <h2 className="text-xl font-bold text-on-surface px-2">우물가에 새겨진 기록들</h2>
        
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-error/10 text-error font-semibold rounded-2xl">{error}</div>
        ) : entries.length === 0 ? (
          <div className="p-16 text-center text-on-surface-variant font-medium bg-surface-container-lowest border border-outline/10 rounded-3xl">
            아직 승인된 기록이 없습니다.
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                key={entry.id} 
                className="bg-surface p-6 rounded-2xl border border-outline/10 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-primary">{entry.nickname}</span>
                  <span className="text-xs text-on-surface-variant">
                    {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString() : '방금 전'}
                  </span>
                </div>
                <p className="text-on-surface font-medium leading-relaxed whitespace-pre-wrap word-break-all">
                  {entry.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
