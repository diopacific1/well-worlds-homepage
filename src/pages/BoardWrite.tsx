import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, PenLine } from "lucide-react";

export default function BoardWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !authorName.trim() || !db) return;

    try {
      setIsSubmitting(true);
      setError("");
      const docRef = await addDoc(collection(db, "board"), {
        title: title.trim(),
        content: content.trim(),
        authorName: authorName.trim(),
        createdAt: serverTimestamp(),
      });
      // 작성 성공 시 만들어진 게시물 상세 페이지로 이동
      navigate(`/board/${docRef.id}`);
    } catch (err: any) {
      console.error(err);
      setError("글 작성에 실패했습니다. Firebase 권한이나 에러를 확인해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 w-full animate-in fade-in pb-12">
      <button 
        onClick={() => navigate("/board")} 
        className="self-start flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        글쓰기 취소
      </button>

      <form 
        onSubmit={handleSubmit} 
        className="bg-surface border border-outline/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6"
      >
        <div className="border-b border-outline/20 pb-4 mb-2 flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <PenLine className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">새 게시글 작성</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-sm font-bold text-on-surface-variant ml-1">작성자</label>
            <input 
              type="text" 
              placeholder="이름을 입력하세요" 
              value={authorName} 
              onChange={(e) => setAuthorName(e.target.value)} 
              required 
              maxLength={20} 
              className="px-4 py-3 bg-surface-container-lowest border border-outline/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all w-full font-medium" 
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-2/3">
            <label className="text-sm font-bold text-on-surface-variant ml-1">제목</label>
            <input 
              type="text" 
              placeholder="게시글 제목" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              maxLength={100} 
              className="px-4 py-3 bg-surface-container-lowest border border-outline/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all w-full font-medium" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant ml-1">내용</label>
          <textarea 
            placeholder="자유롭게 이야기를 작성해주세요..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
            maxLength={2000} 
            className="px-4 py-3 bg-surface-container-lowest border border-outline/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all min-h-[300px] resize-y font-medium leading-relaxed" 
          />
        </div>

        {error && (
          <p className="text-error text-sm font-semibold p-3 bg-error/10 rounded-xl">{error}</p>
        )}

        <div className="flex justify-end pt-4 border-t border-outline/10">
          <button 
            type="submit" 
            disabled={isSubmitting || !title.trim() || !content.trim() || !authorName.trim()} 
            className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md text-lg"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "등록 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}
