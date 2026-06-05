import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Send, UserCircle2, Loader2, ShieldCheck } from 'lucide-react';

interface Entry {
  id: string;
  name: string;
  message: string;
  createdAt: any;
}

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. 데이터 읽기 (Read Data)
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        // messages 컬렉션에서 시간순 정렬하여 쿼리 생성
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedEntries: Entry[] = [];
        querySnapshot.forEach((doc) => {
          fetchedEntries.push({ id: doc.id, ...doc.data() } as Entry);
        });
        
        setEntries(fetchedEntries);
      } catch (err: any) {
        console.error("데이터 읽기 에러:", err);
        if (err.code === 'permission-denied') {
          setError('데이터를 읽을 권한이 없습니다. (Firestore 보안 규칙을 확인하세요)');
        } else {
          setError('데이터를 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // 2. 데이터 추가 (Write Data)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      setIsSubmitting(true);
      setError('');
      
      // messages 컬렉션에 새 문서 추가
      const newDocRef = await addDoc(collection(db, 'messages'), {
        name: name.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(), // 서버 시간 사용 (보안상 안전)
      });
      
      // 화면에 즉시 반영 (낙관적 업데이트)
      setEntries(prev => [{
        id: newDocRef.id,
        name: name.trim(),
        message: message.trim(),
        createdAt: { toDate: () => new Date() } // 임시 날짜 객체
      }, ...prev]);
      
      setName('');
      setMessage('');
    } catch (err: any) {
      console.error("데이터 쓰기 에러:", err);
      if (err.code === 'permission-denied') {
        setError('데이터를 쓸 권한이 없습니다. (Firestore 보안 규칙을 확인하세요)');
      } else {
        setError('메시지 저장에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 w-full animate-in fade-in duration-700">
      <header className="flex flex-col gap-4 border-b border-outline/20 pb-8">
        <h1 className="text-3xl font-display font-black tracking-tight text-on-surface">광장 방명록</h1>
        <p className="text-on-surface-variant font-medium">
          Firebase Firestore를 이용해 데이터를 추가하고 읽어오는 예제입니다.
        </p>
      </header>

      {/* 보안 규칙 안내 박스 */}
      <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-full shrink-0 text-primary">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1 text-sm text-on-surface">
          <p className="font-bold text-primary">Firestore 보안 규칙 점검</p>
          <p className="text-on-surface-variant">
            에러가 발생한다면 Firebase 콘솔에서 Firestore Database &gt; Rules 탭으로 이동하여 규칙을 수정해야 합니다. 
            (하단의 AI 답변을 참조하세요)
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-6">
        <div className="bg-surface border border-outline/20 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            방명록 남기기
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 bg-surface-container-lowest border border-outline/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-on-surface w-full md:w-1/3"
              required
            />
            <textarea
              placeholder="당신의 이야기를 기록해주세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="px-4 py-3 bg-surface-container-lowest border border-outline/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-on-surface min-h-[120px] resize-y"
              required
            />
            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="self-end px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md mt-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              기록하기
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            광장의 목소리 <span className="text-primary text-sm bg-primary/10 px-2 py-0.5 rounded-full">{entries.length}</span>
          </h3>
          
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant bg-surface rounded-3xl border border-outline/20">
                <p className="font-semibold">아직 아무도 이야기를 남기지 않았습니다.</p>
                <p className="text-sm mt-1">이곳에 첫 번째 발자국을 남겨보세요.</p>
              </div>
            ) : (
              <AnimatePresence>
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-surface border border-outline/20 rounded-2xl flex flex-col gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <UserCircle2 className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{entry.name}</span>
                        <span className="text-xs text-on-surface-variant">
                          {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleString() : '방금 전'}
                        </span>
                      </div>
                    </div>
                    <p className="text-on-surface font-medium leading-relaxed bg-surface-container-lowest p-4 rounded-xl">
                      {entry.message}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
