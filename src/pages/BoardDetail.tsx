import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, UserCircle2, Clock } from "lucide-react";

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!db || !id) return;
      try {
        const docRef = doc(db, "board", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("게시글을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 w-full animate-in fade-in pb-12">
      <button 
        onClick={() => navigate("/board")} 
        className="self-start flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        목록으로
      </button>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : error || !post ? (
        <div className="bg-surface border border-outline/20 p-12 rounded-3xl text-center text-error font-medium shadow-sm">
          {error || "데이터가 없습니다."}
        </div>
      ) : (
        <article className="bg-surface border border-outline/20 rounded-3xl p-5 md:p-10 shadow-sm flex flex-col gap-6 md:gap-8">
          <header className="flex flex-col gap-4 border-b border-outline/20 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface break-all leading-snug">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant font-medium">
              <div className="flex items-center gap-1.5 text-primary">
                <UserCircle2 className="w-5 h-5" />
                <span>{post.authorName}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-outline/30" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : '방금 전'}</span>
              </div>
            </div>
          </header>
          <div className="text-on-surface text-sm md:text-base font-medium leading-loose whitespace-pre-wrap rounded-xl min-h-[300px]">
            {post.content}
          </div>
        </article>
      )}
    </div>
  );
}
