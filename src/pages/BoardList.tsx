import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Loader2, PenSquare, Trash2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  authorName: string;
  createdAt: any;
}

export default function BoardList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) {
      setError("Firebase가 연결되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    const q = query(collection(db, "board"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(fetchedPosts);
      setIsLoading(false);
    }, (err) => {
      console.error(err);
      setError("데이터를 불러올 수 없습니다. 시스템 오류이거나 권한이 없습니다.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    if (!db) return;
    
    try {
      await deleteDoc(doc(db, "board", id));
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 w-full animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline/20 pb-6 md:pb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-on-surface">자유 게시판</h1>
          <p className="text-on-surface-variant font-medium mt-2 text-sm md:text-base">자유롭게 이야기를 나누는 공간입니다.</p>
        </div>
        <button 
          onClick={() => navigate("/board/new")} 
          className="px-4 md:px-5 py-2 md:py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <PenSquare className="w-4 h-4" />
          글쓰기
        </button>
      </header>

      <section className="bg-surface border border-outline/20 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline/20 text-on-surface-variant text-sm">
                <th className="p-3 md:p-4 font-bold w-12 md:w-20 text-center whitespace-nowrap">번호</th>
                <th className="p-3 md:p-4 font-bold whitespace-nowrap min-w-[200px]">제목</th>
                <th className="p-3 md:p-4 font-bold w-24 md:w-32 text-center whitespace-nowrap">작성자</th>
                <th className="p-3 md:p-4 font-bold w-20 md:w-32 text-center whitespace-nowrap hidden sm:table-cell">작성일</th>
                {isAdmin && <th className="p-3 md:p-4 font-bold w-16 text-center whitespace-nowrap">관리</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="p-12 text-center text-primary">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="p-16 text-center text-on-surface-variant font-medium">
                    등록된 게시글이 없습니다. 첫 번째 글을 작성해보세요!
                  </td>
                </tr>
              ) : (
                posts.map((post, index) => (
                  <tr 
                    key={post.id} 
                    onClick={() => navigate(`/board/${post.id}`)} 
                    className="border-b border-outline/10 hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                  >
                    <td className="p-3 md:p-4 text-center text-xs md:text-sm text-on-surface-variant font-medium">
                      {posts.length - index}
                    </td>
                    <td className="p-3 md:p-4 text-sm md:text-base font-medium text-on-surface group-hover:text-primary transition-colors pr-4 md:pr-8">
                      {post.title}
                    </td>
                    <td className="p-3 md:p-4 text-center text-xs md:text-sm text-on-surface-variant">
                      {post.authorName}
                    </td>
                    <td className="p-3 md:p-4 text-center text-xs md:text-sm text-on-surface-variant hidden sm:table-cell">
                      {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : '방금 전'}
                    </td>
                    {isAdmin && (
                      <td className="p-3 md:p-4 text-center">
                        <button
                          onClick={(e) => handleDelete(e, post.id)}
                          className="p-2 text-error/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {error && <div className="p-6 text-center bg-error/10 text-error font-semibold">{error}</div>}
      </section>
    </div>
  );
}
